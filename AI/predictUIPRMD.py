from model import *
import json
import torch
import random

# edges = [
#     (0, 1), (1, 2), (2, 3), (3, 4), 
#     (4, 5), (5, 6), (6, 7), 
#     (8, 9), (9, 10), (10, 11), 
#     (0, 12), (12, 13), (13, 14), (14, 15), 
#     (0, 16), (16, 17), (17, 18), (18, 19), 
#     (2, 20), (7, 21), (6, 22), 
#     (11, 23), (10, 24)
# ]

# edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()

edge_index = torch.tensor([(0, 1), (2, 3), (6, 7), (4, 8), (8, 5), (0, 4), (4, 16), (16, 17),
                  (16, 17), (17, 18), (18, 19), (19, 20), (20, 21), (21, 22), (4, 9), (9, 10),
                  (10, 11), (11, 12), (12, 13), (13, 14), (14, 15), (5, 23), (5, 24), (5, 25), (5, 26),
                  (25, 27), (27, 28), (28, 29), (29, 30), (30, 31), (31, 32), (26, 33), (33, 34),
                  (34, 35), (35, 36), (36, 37), (37, 38)])
edge_index = edge_index.T 

def predict_single_sample(model, sample, device, model_name):
    
    model.eval()
    model.to(device)

    with torch.no_grad():
        sample = sample.to(device).unsqueeze(0)  
     
        output = model(sample, edge_index.to(device))  
        out_cts = output[:, 0] 
        y_pred = (out_cts.cpu().numpy())[0]      

    return y_pred

# input (50, 39, 3)

def load_sample_from_json(filepath, device='cpu'):
    with open(filepath, 'r') as f:
        data = json.load(f)

    coords_tensor = torch.tensor([], dtype=torch.float32).to(device)

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
            ])
        
        # Nếu số khớp < 39 → thêm khớp random
        num_current_joints = len(joint_names)
        missing_joints = 39 - num_current_joints
        if missing_joints > 0:
            for _ in range(missing_joints):
                # random trong khoảng tương đương với tọa độ thật
                coords.extend([
                    random.uniform(-1, 1),  # X
                    random.uniform(-1, 1),  # Y
                    random.uniform(-1, 1)   # Z
                ])

   
        coords_tensor = torch.cat((
            coords_tensor, 
            torch.tensor(coords, dtype=torch.float32).to(device)
        ), dim=0)

    coords_tensor = coords_tensor.view(len(data), 39, 3)  # (50, 39, 3)
    return coords_tensor

sample_tensor = load_sample_from_json("AI/weights/test_data/kinect_data_300.json", device='cuda')

model = FiveStreamGCN_Model(num_joints=39, num_features=3, hidden_dim=128, num_layers=3,  feat_d=741,
                                output_dim=1, dropout=0.15)

model.load_state_dict(torch.load(r"C:\Users\Admin\Documents\GitHub\Rehabilation-H3MS-GCN\AI\weights\uiprmd\model_Ex4.pth", map_location='cuda:0'))

y_pred = predict_single_sample(model, sample_tensor, device='cuda', model_name='FiveStreamGCN_Model')

print("Pred:", y_pred)