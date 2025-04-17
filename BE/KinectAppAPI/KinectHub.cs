using Microsoft.AspNetCore.SignalR;

namespace KinectAppAPI
{
    public class KinectHub : Hub
    {
        private static string? _aiConnectionId;
        private static readonly Dictionary<string, string> _clients = [];

        public async Task SendFrameToUser(string userId, string data)
        {
            if (_clients.TryGetValue(userId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveFrame", data);
            }
            else
            {
                Console.WriteLine($"User {userId} not found.");
            }
        }

        public async Task SendBatchToAI(string userId, string data)
        {
            if (!string.IsNullOrEmpty(userId) && _aiConnectionId != null)
            {
                await Clients.Client(_aiConnectionId).SendAsync("ReceiveBatch", userId, data);
            }
            else
            {
                Console.WriteLine($"User {userId} not found.");
            }
        }

        public async Task SendScore(string userId, float data)
        {
            if (_clients.TryGetValue(userId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveScore", data);
            }
            else
            {
                Console.WriteLine($"User {userId} not found.");
            }
        }

        public override Task OnConnectedAsync()
        {
            var clientType = Context.GetHttpContext()?.Request.Query["type"].ToString();
            var userId = Context.GetHttpContext()?.Request.Query["userId"].ToString();

            if (clientType == "ui" && !string.IsNullOrEmpty(userId))
            {
                _clients[userId] = Context.ConnectionId;
                Console.WriteLine($"UI client connected: {userId} - {Context.ConnectionId}");
            }
            else if (clientType == "ai")
            {
                _aiConnectionId = Context.ConnectionId;
                Console.WriteLine($"AI client connected: {Context.ConnectionId}");
            }
            else
            {
                Console.WriteLine($"Client connected: {Context.ConnectionId}");
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = _clients.FirstOrDefault(c => c.Value == Context.ConnectionId).Key;
            if (!string.IsNullOrEmpty(userId))
            {
                _clients.Remove(userId);
                Console.WriteLine($"UI client disconnected: {userId} - {Context.ConnectionId}");
            }
            else if (_aiConnectionId == Context.ConnectionId)
            {
                _aiConnectionId = null;
                Console.WriteLine($"AI client disconnected: {Context.ConnectionId}");
            }
            else
            {
                Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}