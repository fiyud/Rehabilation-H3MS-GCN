import torch
import torch.nn as nn

class MahalanobisDistanceModule(nn.Module):
    def __init__(self, coord_dim=3):
        super(MahalanobisDistanceModule, self).__init__()
        self.L = nn.Linear(coord_dim, coord_dim, bias=False)
        
    def forward_diff(self, diff):
        diff_transformed = self.L(diff)
        return torch.norm(diff_transformed, p=2, dim=-1)
    
    def forward(self, p_i, p_j):
        diff = p_i - p_j
        return self.forward_diff(diff)

def get_JCD_mahalanobis(p, distance_module):
    batch_size, time_step, num_joints, coord_dim = p.shape
    p_i = p.unsqueeze(3)
    p_j = p.unsqueeze(2)
    diff = p_i - p_j
    
    indices = torch.triu_indices(num_joints, num_joints, offset=1, device=p.device)
    diff_pairs = diff[:, :, indices[0], indices[1], :]
    
    diff_flat = diff_pairs.reshape(-1, coord_dim)
    distances_flat = distance_module.forward_diff(diff_flat)
    
    JCD = distances_flat.reshape(batch_size, time_step, -1)
    JCD = (JCD - JCD.min()) / (JCD.max() - JCD.min() + 1e-8)
    return JCD