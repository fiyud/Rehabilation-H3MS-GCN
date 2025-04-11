from model import *
import json
import torch

edges = [
    (0, 1), (1, 2), (2, 3), (3, 4), 
    (4, 5), (5, 6), (6, 7), 
    (8, 9), (9, 10), (10, 11), 
    (0, 12), (12, 13), (13, 14), (14, 15), 
    (0, 16), (16, 17), (17, 18), (18, 19), 
    (2, 20), (7, 21), (6, 22), 
    (11, 23), (10, 24)
]

edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()

def predict_single_sample(model, sample, device, model_name):
    
    model.eval()
    model.to(device)

    with torch.no_grad():
        sample = sample.to(device).unsqueeze(0)  
     
        output = model(sample, edge_index.to(device))  
        out_cts = output[:, 0] 
        y_pred = (out_cts.cpu().numpy() * 50)[0]      

    return y_pred

# input (50, 25, 7)

def load_sample_from_json(filepath, device='cpu'):
    with open(filepath, 'r') as f:
        data = json.load(f)
    coords_tensor = torch.tensor([], dtype=torch.float32).to(device)
    #  input 50, 25, 7 
    for i in range(len(data)):
        
        frame = data[i]  
        
        joints = frame['Skeletons'][0]['Joints']

        joint_names = list(joints.keys())

        coords = []
        for joint in joint_names:
            coords.extend([
                joints[joint]['X'],
                joints[joint]['Y'],
                joints[joint]['Z'],
                0,
                0,
                0,
                0
            ])
        coords_tensor = torch.cat((coords_tensor, torch.tensor(coords, dtype=torch.float32).to(device)), dim=0)
    coords_tensor = coords_tensor.view(50, 25, 7)  # Reshape to (50, 25, 7)
    return coords_tensor 

sample_tensor = load_sample_from_json("AI/weights/test_data/kinect_data_300.json", device='cuda')

model= FiveStreamGCN_Model(num_joints=25, num_features=7, hidden_dim=128, num_layers=3, 
                                output_dim=1, feat_d=300, nhead=4, dropout=0.15)

model.load_state_dict(torch.load("AI/weights/kimore/model_ex1.pth", map_location='cuda:0'))

y_pred = predict_single_sample(model, sample_tensor, device='cuda', model_name='FiveStreamGCN_Model')

print("Pred:", y_pred)