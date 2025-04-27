using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows;
using VnuRehab.Models;

namespace VnuRehab.Services
{
    public class SignalRService : IAsyncDisposable
    {
        private readonly string _userId;
        private HubConnection _connection;
        private bool _isConnected;
        public bool IsConnected
        {
            get => _isConnected;
            set
            {
                _isConnected = value;
                OnConnectionChanged?.Invoke(this, EventArgs.Empty);
            }
        }
        public event EventHandler<EventArgs> OnConnectionChanged;
        public event Action<decimal> OnScoreReceived;

        public SignalRService(UserSessionService userSessionService)
        {
            _userId = userSessionService.CurrentUser?.Id ?? throw new InvalidOperationException("User not logged in.");
            _connection = new HubConnectionBuilder()
                .WithUrl($"http://localhost:8080/kinecthub?type=ui&userId={_userId}")
                .WithAutomaticReconnect()
                .Build();
            _connection.On<decimal>("ReceiveScore", score => OnScoreReceived?.Invoke(score));
            _connection.Closed += async (error) =>
            {
                IsConnected = false;
                if (error != null)
                {
                    MessageBox.Show("SignalR connection closed.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    await Task.Delay(TimeSpan.FromSeconds(2));
                    await ConnectAsync();
                }
            };
            _connection.Reconnecting += (error) =>
            {
                IsConnected = false;
                return Task.CompletedTask;
            };
            _connection.Reconnected += (id) =>
            {
                IsConnected = true;
                return Task.CompletedTask;
            };
            IsConnected = false;
        }

        public async Task ConnectAsync()
        {
            if (_connection is null || IsConnected) return;
            try
            {
                await _connection.StartAsync();
                IsConnected = true;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error connecting to SignalR: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public async Task DisconnectAsync()
        {
            if (_connection != null)
            {
                try
                {
                    await _connection.StopAsync();
                    await _connection.DisposeAsync();
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error disconnecting from SignalR: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
                finally
                {
                    IsConnected = false;
                    _connection = null;
                }
            }
        }

        public async Task SendBatchAsync(List<SkeletonFrame> batch)
        {
            if (_connection != null && _connection.State == HubConnectionState.Connected)
            {
                await _connection.InvokeAsync("SendBatchToAI", _userId, JsonConvert.SerializeObject(batch));
            }
        }

        public async ValueTask DisposeAsync()
        {
            await DisconnectAsync();
        }
    }
}
