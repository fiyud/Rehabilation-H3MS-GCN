from signalrcore.hub_connection_builder import HubConnectionBuilder
import json
import time
from model import *
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

def load_sample_from_json(data, device='cpu'):
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

hub_conn = HubConnectionBuilder().with_url("http://localhost:5160/kinectHub?type=ai").build()

def handle_skeleton_data(args):
    try:
        data = json.loads(args[0])
        sample_tensor = load_sample_from_json(data, device='cuda')

        model= FiveStreamGCN_Model(num_joints=25, num_features=7, hidden_dim=128, num_layers=3, 
                                   output_dim=1, feat_d=300, nhead=4, dropout=0.15)

        model.load_state_dict(torch.load("weights/kimore/model_ex1.pth", map_location='cuda:0'))

        y_pred = predict_single_sample(model, sample_tensor, device='cuda', model_name='FiveStreamGCN_Model')
        hub_conn.send("SendScore", [float(y_pred)])
    except Exception as e:
        print(e)

hub_conn.on("ReceiveBatch", handle_skeleton_data)
hub_conn.start()
print("Connected to hub")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Shutting down.")
    hub_conn.stop()
