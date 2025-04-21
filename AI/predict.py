edges = [
    (0, 1), (1, 2), (2, 3), (3, 4), 
    (4, 5), (5, 6), (6, 7), 
    (8, 9), (9, 10), (10, 11), 
    (0, 12), (12, 13), (13, 14), (14, 15), 
    (0, 16), (16, 17), (17, 18), (18, 19), 
    (2, 20), (7, 21), (6, 22), 
    (11, 23), (10, 24)
]

class Kimore:
    def __init__(self):
        self.edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()

    def load_sample_from_json(self, data, device='cpu'):
        coords_tensor = torch.tensor([], dtype=torch.float32).to(device)
        #  input 50, 25, 7 
        for i in range(len(data)):
            frame = data[i]  
            joints = frame['Skeletons'][0]['Joints']
            joint_names = list(joints.keys())
            coords = []
            for joint in joint_names:
                coords.extend([joints[joint]['X'], joints[joint]['Y'], joints[joint]['Z'], 0, 0, 0, 0])
            coords_tensor = torch.cat((coords_tensor, torch.tensor(coords, dtype=torch.float32).to(device)), dim=0)

        coords_tensor = coords_tensor.view(50, 25, 7)  # Reshape to (50, 25, 7)
        return coords_tensor 

    def predict_single_sample(self, model, sample, device, model_name):
        model.eval()
        model.to(device)

        with torch.no_grad():
            sample = sample.to(device).unsqueeze(0)  
         
            output = model(sample, self.edge_index.to(device))  
            out_cts = output[:, 0] 
            y_pred = (out_cts.cpu().numpy() * 50)[0]      

        return y_pred

class UIPRMD:
    def __init__(self):
        self.edge_index = torch.tensor([(0, 1), (2, 3), (6, 7), (4, 8), (8, 5), (0, 4), (4, 16), (16, 17),
                                        (16, 17), (17, 18), (18, 19), (19, 20), (20, 21), (21, 22), (4, 9), (9, 10),
                                        (10, 11), (11, 12), (12, 13), (13, 14), (14, 15), (5, 23), (5, 24), (5, 25), (5, 26),
                                        (25, 27), (27, 28), (28, 29), (29, 30), (30, 31), (31, 32), (26, 33), (33, 34),
                                        (34, 35), (35, 36), (36, 37), (37, 38)])
        self.edge_index = self.edge_index.T 

    def load_sample_from_json(self, data, device='cpu'):
        coords_tensor = torch.tensor([], dtype=torch.float32).to(device)
        for i in range(len(data)):
            frame = data[i]
            joints = frame['Skeletons'][0]['Joints']
            joint_names = list(joints.keys())
            coords = []
            for joint in joint_names:
                coords.extend([joints[joint]['X'], joints[joint]['Y'], joints[joint]['Z']])
            
            # Nếu số khớp < 39 -> thêm khớp random
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

    def predict_single_sample(self, model, sample, device, model_name):
        model.eval()
        model.to(device)

        with torch.no_grad():
            sample = sample.to(device).unsqueeze(0)  
         
            output = model(sample, self.edge_index.to(device))  
            out_cts = output[:, 0] 
            y_pred = (out_cts.cpu().numpy())[0]      

        return y_pred
