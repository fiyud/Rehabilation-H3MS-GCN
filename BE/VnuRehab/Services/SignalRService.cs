using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VnuRehab.Models;

namespace VnuRehab.Services
{
    public class SignalRService
    {
        private HubConnection _connection;
        private string _userId;
        public event Action<decimal> OnScoreReceived;

        public SignalRService(string userId)
        {
            _userId = userId;
        }

        public async Task ConnectAsync()
        {
            _connection = new HubConnectionBuilder()
                .WithUrl($"http://localhost:8080/kinecthub")
                .WithAutomaticReconnect()
                .Build();
            _connection.On<decimal>("ReceiveScore", score => OnScoreReceived?.Invoke(score));
            await _connection.StartAsync();
        }

        public async Task DisconnectAsync()
        {
            if (_connection != null)
            {
                await _connection.StopAsync();
                await _connection.DisposeAsync();
                _connection = null;
            }
        }

        public async Task SendBatchAsync(List<SkeletonFrame> batch)
        {
            if (_connection != null && _connection.State == HubConnectionState.Connected)
            {
                try
                {
                    await _connection.InvokeAsync("SendBatchToAI", _userId, JsonConvert.SerializeObject(batch));
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending batch: {ex.Message}");
                }
            }
        }
    }
}
