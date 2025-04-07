import torch
import torch.nn as nn
import torch.nn.functional as F
from common import Shift_gcn, HyperComputeModule
from utils import MahalanobisDistanceModule, get_JCD_mahalanobis
from torch_geometric.nn import GCNConv
from torch.nn import TransformerEncoder, TransformerEncoderLayer

class FiveStreamMaha_GCN_Model(nn.Module):
    def __init__(self, num_joints, num_features, hidden_dim, num_layers, output_dim, feat_d, max_time_step=150, nhead=4, dropout=0.1):
        super(FiveStreamMaha_GCN_Model, self).__init__()

        self.hidden_dim = hidden_dim
        self.num_joints = num_joints

        self.skeleton_gcn1 = Shift_gcn(in_channels=num_features, out_channels=hidden_dim, num_nodes=num_joints)
        self.skeleton_gcn2 = Shift_gcn(in_channels=hidden_dim, out_channels=hidden_dim, num_nodes=num_joints)
        
        self.skeleton_hyper_module = HyperComputeModule(
            c1=hidden_dim,
            c2=hidden_dim,
            reduction=16,
            edge_dim=3,
            hidden_dim=32
        )
        
        self.skeleton_transformer_layer = TransformerEncoderLayer(
            d_model=hidden_dim,
            nhead=nhead,
            dim_feedforward=hidden_dim * 4,
            dropout=dropout
        )
        self.skeleton_transformer = TransformerEncoder(self.skeleton_transformer_layer, num_layers=1)
        
        self.jcd_gcn1 = Shift_gcn(in_channels=feat_d, out_channels=hidden_dim, num_nodes=1)
        self.jcd_gcn2 = Shift_gcn(in_channels=hidden_dim, out_channels=hidden_dim, num_nodes=1)
        
        self.spatial_gcn1 = Shift_gcn(in_channels=num_features, out_channels=hidden_dim, num_nodes=num_joints)
        self.spatial_gcn2 = Shift_gcn(in_channels=hidden_dim, out_channels=hidden_dim, num_nodes=num_joints)
        
        self.topo_feat_dim = 9  # 3 features (avg, std, min) for k=2,3,4
        self.topo_gcn1 = GCNConv(self.topo_feat_dim, hidden_dim)
        self.topo_gcn2 = GCNConv(hidden_dim, hidden_dim)
        
        self.stats_feat_dim = 6  # mean, std, max, min, skew, kurtosis
        self.stats_gcn1 = GCNConv(self.stats_feat_dim, hidden_dim)
        self.stats_gcn2 = GCNConv(hidden_dim, hidden_dim)
        
        concat_size = num_joints * hidden_dim + hidden_dim + hidden_dim + hidden_dim + hidden_dim
        self.fusion_layer = nn.Sequential(
            nn.Linear(concat_size, hidden_dim * 2),
            nn.LayerNorm(hidden_dim * 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim * 2, hidden_dim)
        )
        
        self.gru = nn.GRU(
            input_size=hidden_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout
        )
        
        self.fc = nn.Linear(hidden_dim, output_dim)
        
        self.mah_distance_module = MahalanobisDistanceModule(coord_dim=3)
        
    def forward(self, x, edge_index, jcd=None, jcd_edge_index=None):
        batch_size, time_step, num_joints, num_features = x.shape
        
        if jcd_edge_index is None:
            jcd_edge_index = edge_index
        
        skeleton_x = F.relu(self.skeleton_gcn1(x, edge_index))
        skeleton_x = skeleton_x.permute(0, 2, 3, 1).contiguous()
        skeleton_x = F.relu(self.skeleton_gcn2(skeleton_x, edge_index))
        skeleton_x = skeleton_x.permute(0, 2, 3, 1).contiguous()
        skeleton_x = skeleton_x.view(batch_size * time_step, num_joints, -1)
        
        hyper_input = skeleton_x.permute(0, 2, 1).unsqueeze(-1)
        hyper_output = self.skeleton_hyper_module(hyper_input)
        skeleton_x = hyper_output.squeeze(-1).permute(0, 2, 1)
        
        transformer_input = skeleton_x.permute(1, 0, 2).contiguous()
        transformer_output = self.skeleton_transformer(transformer_input)
        skeleton_features = transformer_output.permute(1, 0, 2).contiguous()
        skeleton_features = skeleton_features.reshape(batch_size, time_step, num_joints * self.hidden_dim)
        
        pos_data = x[:, :, :, :3]
        if jcd is None:
            jcd = get_JCD_mahalanobis(pos_data, self.mah_distance_module)
        jcd_flat = jcd.unsqueeze(2)
        jcd_feat = F.relu(self.jcd_gcn1(jcd_flat))
        jcd_feat = jcd_feat.permute(0, 2, 3, 1).contiguous()
        jcd_feat = F.relu(self.jcd_gcn2(jcd_feat))
        jcd_feat = jcd_feat.permute(0, 2, 3, 1).contiguous() 
        jcd_features = jcd_feat.reshape(batch_size, time_step, -1)
        
        num_nodes = num_joints
        spatial_edge_index = torch.zeros((2, num_nodes * num_nodes), dtype=torch.long, device=edge_index.device)
        idx = 0
        for i in range(num_nodes):
            for j in range(num_nodes):
                spatial_edge_index[0, idx] = i
                spatial_edge_index[1, idx] = j
                idx += 1
        
        spatial_features = F.relu(self.spatial_gcn1(x, spatial_edge_index))
        spatial_features = spatial_features.permute(0, 2, 3, 1).contiguous()
        spatial_features = F.relu(self.spatial_gcn2(spatial_features, spatial_edge_index))
        spatial_features = spatial_features.permute(0, 2, 3, 1).contiguous()
        spatial_features = spatial_features.reshape(batch_size, time_step, num_joints, -1)
        spatial_features = torch.mean(spatial_features, dim=2)
        
        topo_features_list = []
        for k in [2, 3, 4]:
            frame_topo_list = []
            for t in range(time_step):
                pos = x[:, t, :, :3]  # Assuming first 3 features are spatial coordinates
                distances = torch.cdist(pos, pos, p=2)
                actual_k = min(k, num_joints - 1)
                _, knn_indices = torch.topk(distances, k=actual_k + 1, dim=2, largest=False)
                knn_indices = knn_indices[:, :, 1:actual_k + 1]
                batch_indices = torch.arange(batch_size).view(-1, 1, 1).expand(-1, num_joints, actual_k)
                joint_indices = torch.arange(num_joints).view(1, -1, 1).expand(batch_size, -1, actual_k)
                if x.device.type == 'cuda':
                    batch_indices = batch_indices.cuda()
                    joint_indices = joint_indices.cuda()
                knn_distances = torch.gather(distances, 2, knn_indices)
                avg_dist = torch.mean(knn_distances, dim=2)
                std_dist = torch.std(knn_distances, dim=2)
                min_dist, _ = torch.min(knn_distances, dim=2)
                k_features = torch.stack([avg_dist, std_dist, min_dist], dim=2)
                frame_topo_list.append(k_features)
            k_topo_features = torch.stack(frame_topo_list, dim=1).mean(dim=1)
            topo_features_list.append(k_topo_features)
            
        topo_features = torch.cat(topo_features_list, dim=2)  # [batch_size, num_joints, topo_feat_dim]
        topo_features_flat = topo_features.reshape(-1, self.topo_feat_dim)
        topo_edge_index = edge_index % num_joints
        
        topo_gcn_out = F.relu(self.topo_gcn1(topo_features_flat, topo_edge_index))
        topo_gcn_out = F.relu(self.topo_gcn2(topo_gcn_out, topo_edge_index))
        topo_features = topo_gcn_out.reshape(batch_size, num_joints, -1).mean(dim=1)
        topo_features = topo_features.unsqueeze(1).expand(-1, time_step, -1)
        
        stats_features_list = []
        for j in range(num_joints):
            joint_data = x[:, :, j, :]
            mean_feat = torch.mean(joint_data, dim=1)
            std_feat = torch.std(joint_data, dim=1)
            min_feat, _ = torch.min(joint_data, dim=1)
            max_feat, _ = torch.max(joint_data, dim=1)
            centered = joint_data - mean_feat.unsqueeze(1)
            var = torch.var(joint_data, dim=1) + 1e-10
            skew = torch.mean(centered**3, dim=1) / (torch.sqrt(var)**3 + 1e-10)
            kurt = torch.mean(centered**4, dim=1) / (var**2 + 1e-10) - 3.0
            avg_stats = torch.stack([torch.mean(mean_feat, dim=1), torch.mean(std_feat, dim=1),
                                     torch.mean(min_feat, dim=1), torch.mean(max_feat, dim=1),
                                     torch.mean(skew, dim=1), torch.mean(kurt, dim=1)], dim=1)
            stats_features_list.append(avg_stats)
            
        stats_features = torch.stack(stats_features_list, dim=1)  # [batch_size, num_joints, stats_feat_dim]
        stats_features_flat = stats_features.reshape(-1, self.stats_feat_dim)
        stats_edge_index = edge_index % num_joints
        
        stats_gcn_out = F.relu(self.stats_gcn1(stats_features_flat, stats_edge_index))
        stats_gcn_out = F.relu(self.stats_gcn2(stats_gcn_out, stats_edge_index))
        stats_features = stats_gcn_out.mean(dim=0, keepdim=True).expand(batch_size, -1)
        stats_features = stats_features.unsqueeze(1).expand(-1, time_step, -1)
        
        combined_features = torch.cat([
            skeleton_features,  # [batch_size, time_step, num_joints * hidden_dim]
            jcd_features,       # [batch_size, time_step, hidden_dim]
            spatial_features,   # [batch_size, time_step, hidden_dim]
            topo_features,      # [batch_size, time_step, hidden_dim]
            stats_features      # [batch_size, time_step, hidden_dim]
        ], dim=2)
        
        fused_features = self.fusion_layer(combined_features)
        gru_out, _ = self.gru(fused_features)
        out = self.fc(gru_out[:, -1, :])
        
        return out