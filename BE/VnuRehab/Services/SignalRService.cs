using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using VnuRehab.Models;

namespace VnuRehab.Services
{
    public class SignalRService : IAsyncDisposable
    {
        private static readonly string BaseUrl = ConfigurationManager.AppSettings["APIUrl"] ?? "http://localhost:8080";
        private readonly string _userId;
        private HubConnection _connection;
        private bool _isConnected;
        public bool IsConnected
        {
            get => _isConnected;
            set
            {
                _isConnected = value;
                OnConnectionChanged?.Invoke(this, value);
            }
        }
        public event EventHandler<bool> OnConnectionChanged;
        public event Action<decimal> OnScoreReceived;

        public SignalRService(UserSessionService userSessionService)
        {
            _userId = userSessionService.CurrentUser?.Id ?? throw new InvalidOperationException("User not logged in.");
            _connection = new HubConnectionBuilder()
                .WithUrl($"{BaseUrl}/kinecthub?type=ui&userId={_userId}")
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
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error disconnecting from SignalR: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
                finally
                {
                    IsConnected = false;
                }
            }
        }

        public async Task SendBatchAsync(List<SkeletonFrame> batch, ExerciseType type)
        {
            if (_connection != null && _connection.State == HubConnectionState.Connected)
            {
                await _connection.InvokeAsync("SendBatchToAI", _userId, type, JsonConvert.SerializeObject(batch));
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (IsConnected)
            {
                await DisconnectAsync();
            }
            if (_connection != null)
            {
                await _connection.DisposeAsync();
                _connection = null;
            }
        }
    }
}
