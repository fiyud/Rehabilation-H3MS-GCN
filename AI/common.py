import torch
import torch.nn as nn
import math
import numpy as np

class Shift_gcn(nn.Module):
    def __init__(self, in_channels, out_channels, A=None, num_nodes=25, coff_embedding=4, num_subset=3):
        super(Shift_gcn, self).__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.num_nodes = num_nodes
        
        if in_channels != out_channels:
            self.down = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, kernel_size=1),
                nn.BatchNorm2d(out_channels)
            )
        else:
            self.down = lambda x: x

        self.Linear_weight = nn.Parameter(torch.zeros(in_channels, out_channels))
        nn.init.normal_(self.Linear_weight, 0, math.sqrt(1.0 / out_channels))

        self.Linear_bias = nn.Parameter(torch.zeros(1, 1, out_channels))
        nn.init.constant_(self.Linear_bias, 0)

        self.Feature_Mask = nn.Parameter(torch.ones(1, num_nodes, in_channels))
        nn.init.constant_(self.Feature_Mask, 0)

        self.bn = nn.BatchNorm1d(num_nodes * out_channels)
        self.relu = nn.ReLU()

        index_array = np.empty(num_nodes * in_channels, dtype=np.int64)
        for i in range(num_nodes):
            for j in range(in_channels):
                index_array[i * in_channels + j] = (i * in_channels + j + j * in_channels) % (in_channels * num_nodes)
        self.register_buffer('shift_in', torch.from_numpy(index_array))

        index_array = np.empty(num_nodes * out_channels, dtype=np.int64)
        for i in range(num_nodes):
            for j in range(out_channels):
                index_array[i * out_channels + j] = (i * out_channels + j - j * out_channels) % (out_channels * num_nodes)
        self.register_buffer('shift_out', torch.from_numpy(index_array))

    def forward(self, x0, edge_index = None):
        x0_proc = x0.permute(0, 3, 1, 2).contiguous()  # (n, c, t, v)
        n, c, t, v = x0_proc.size()
        x = x0_proc.permute(0, 2, 3, 1).contiguous()  # (n, t, v, c)
        x = x.view(n * t, v * c)
        x = torch.index_select(x, 1, self.shift_in)
        x = x.view(n * t, v, c)
        x = x * (torch.tanh(self.Feature_Mask) + 1)
        x = torch.einsum('nwc,cd->nwd', x, self.Linear_weight).contiguous()
        x = x + self.Linear_bias
        x = x.view(n * t, -1)
        x = torch.index_select(x, 1, self.shift_out)
        x = self.bn(x)
        x = x.view(n, t, v, self.out_channels).permute(0, 3, 1, 2).contiguous()
        shortcut = self.down(x0_proc)
        x = x + shortcut
        x = self.relu(x)
        return x

class HyPConv(nn.Module):
    def __init__(self, c1, c2):
        super().__init__()
        self.fc = nn.Linear(c1, c2)
        self.v2e = MessageAgg(agg_method="mean")
        self.e2v = MessageAgg(agg_method="mean")
    def forward(self, x, H):
        x = self.fc(x)
        # v -> e
        E = self.v2e(x, H.transpose(1, 2).contiguous())
        # e -> v
        x = self.e2v(E, H)
        return x

class MessageAgg(nn.Module):
    def __init__(self, agg_method="mean"):
        super().__init__()
        self.agg_method = agg_method
    def forward(self, X, path):
        """
            X: [n_node, dim]
            path: col(source) -> row(target)
        """
        X = torch.matmul(path, X)
        if self.agg_method == "mean":
            norm_out = 1 / torch.sum(path, dim=2, keepdim=True)
            norm_out[torch.isinf(norm_out)] = 0
            X = norm_out * X
            return X
        elif self.agg_method == "sum":
            pass
        return X

class AdaptiveThresholdModule(nn.Module):
    def __init__(self, in_channels, reduction=16):
        super().__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)
        
        mid_channels = max(in_channels // reduction, 8)
        self.mlp = nn.Sequential(
            nn.Linear(in_channels * 2, mid_channels),
            nn.ReLU(inplace=True),
            nn.Linear(mid_channels, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        b, c = x.shape[:2]
        avg_out = self.avg_pool(x).view(b, c)
        max_out = self.max_pool(x).view(b, c)
        feat = torch.cat([avg_out, max_out], dim=1)
        threshold = self.mlp(feat).view(b, 1, 1, 1)
        return threshold

class DynamicEdgeFeatures(nn.Module):
    def __init__(self, edge_dim=3, hidden_dim=32):
        super().__init__()
        self.edge_proj = nn.Sequential(
            nn.Linear(edge_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid()
        )
   
    def forward(self, distance):
        edge_features = torch.stack([
            distance,
            torch.cos(distance),
            torch.exp(-distance)
        ], dim=-1)
       
        edge_weights = self.edge_proj(edge_features)
        return edge_weights.squeeze(-1)

class HyperComputeModule(nn.Module):
    def __init__(self, c1, c2, reduction=16, edge_dim=3, hidden_dim=32):
        super().__init__()
        self.hgconv = HyPConv(c1, c2)  # c1=c2
        self.bn = nn.BatchNorm2d(c2)
        self.act = nn.SiLU()
        
        self.adaptive_threshold = AdaptiveThresholdModule(c1, reduction=reduction)
        self.dynamic_edge = DynamicEdgeFeatures(edge_dim=edge_dim, hidden_dim=hidden_dim)
        
    def forward(self, x):
        b, c, h, w = x.shape[0], x.shape[1], x.shape[2], x.shape[3]
        x = x.view(b, c, -1).transpose(1, 2).contiguous()
        feature = x.clone()
        
        distance = torch.cdist(feature, feature)
        threshold = self.adaptive_threshold(x.transpose(1, 2).contiguous().view(b, c, h, w))
        threshold = threshold.view(b, 1, 1)
        hg = distance < threshold
        
        edge_weights = self.dynamic_edge(distance)
        
        hg = (hg.float() * edge_weights).to(x.device).to(x.dtype)
        x = self.hgconv(x, hg).to(x.device).to(x.dtype) + x

        x = x.transpose(1, 2).contiguous().view(b, c, h, w)
        x = self.act(self.bn(x))

        return x