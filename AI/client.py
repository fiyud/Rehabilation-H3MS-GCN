from signalrcore.hub_connection_builder import HubConnectionBuilder
import os
import json
import time
from model import *
import torch
from predict import *
import signal
import threading

exercises = [
    "weights/kimore/model_ex1.pth",
    "weights/kimore/model_ex2.pth",
    "weights/kimore/model_ex3.pth",
    "weights/kimore/model_ex4.pth",
    "weights/kimore/model_ex5.pth",
    "weights/uiprmd/model_Ex1.pth",
    "weights/uiprmd/model_Ex2.pth",
    "weights/uiprmd/model_Ex3.pth",
    "weights/uiprmd/model_Ex4.pth",
    "weights/uiprmd/model_Ex5.pth",
    "weights/uiprmd/model_Ex6.pth",
    "weights/uiprmd/model_Ex7.pth",
    "weights/uiprmd/model_Ex8.pth",
    "weights/uiprmd/model_Ex9.pth",
    "weights/uiprmd/model_Ex10.pth"
]

shutdown_event = threading.Event()
def handle_shutdown(signum, frame):
    print("Received shutdown signal. Cleaning up...")
    shutdown_event.set()

signal.signal(signal.SIGINT, handle_shutdown)
signal.signal(signal.SIGTERM, handle_shutdown)

server_url = os.environ.get("SERVER_URL", "http://localhost:8080/kinecthub?type=ai")
hub_conn = HubConnectionBuilder().with_url(server_url).build()

use_cuda = torch.cuda_is_available()
if use_cuda:
    print("GPU available")
else:
    print("GPU unavailable. Use CPU")
device = torch.device("cuda" if use_cuda else "cpu")
map_location = torch.device("cuda:0" if use_cuda else "cpu")

def handle_kimore(data, weight):
    kimore = Kimore()
    sample_tensor = kimore.load_sample_from_json(data, device)
    model = FiveStreamGCN_Model(num_joints=25, num_features=7, hidden_dim=128, num_layers=3, 
                                output_dim=1, feat_d=300, nhead=4, dropout=0.15)
    print("Loading: ", weight)
    model.load_state_dict(torch.load(weight, map_location))
    y_pred = kimore.predict_single_sample(model, sample_tensor, device, model_name='FiveStreamGCN_Model')
    return y_pred

def handle_uiprmd(data, weight):
    uiprmd = UIPRMD()
    sample_tensor = uiprmd.load_sample_from_json(data, device)
    model = FiveStreamGCN_Model(num_joints=39, num_features=3, hidden_dim=128, num_layers=3,  feat_d=741,
                                output_dim=1, dropout=0.15)
    print("Loading: ", weight)
    model.load_state_dict(torch.load(weight, map_location))
    y_pred = uiprmd.predict_single_sample(model, sample_tensor, device, model_name='FiveStreamGCN_Model')
    return y_pred
    
def handle_skeleton_data(args):
    try:
        if len(args) != 3:
            raise ValueError("Expected 3 arguments: [user_id, exercise_type, data]")
        index = int(args[1])
        if index < 0 or index >= len(exercises):
            raise ValueError(f"Invalid exercise index: {index}")

        weight = exercises[index]
        data = json.loads(args[2])

        if index < 5:
            y_pred = handle_kimore(data, weight)
        else:
            y_pred = handle_uiprmd(data, weight)
        
        hub_conn.send("SendScore", [args[0], float(y_pred)])
    except Exception as e:
        print(e)

hub_conn.on("ReceiveBatch", handle_skeleton_data)

hub_conn.start()
print("Connected. Press Ctrl+C to exit.")

shutdown_event.wait()
hub_conn.stop()
print("Connection closed. Exiting.")
