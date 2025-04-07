from model import FiveStreamMaha_GCN_Model

model = FiveStreamMaha_GCN_Model(
    num_joints=25,
    num_features=7,
    hidden_dim=128,
    num_layers=3,
    output_dim=2,
    feat_d=300,
    nhead=4,
    dropout=0.15
)