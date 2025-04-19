using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace KinectAppAPI
{
    public class KinectHub : Hub
    {
        public struct ClientContext
        {
            public string ConnectionId { get; set; }
            public ExerciseType? ExerciseType { get; set; }
        }

        private static string? _aiConnectionId;
        private static readonly ConcurrentDictionary<string, ClientContext> _clients = [];

        public async Task SendFrameToUser(string userId, string data)
        {
            if (_clients.TryGetValue(userId, out var context) && !string.IsNullOrEmpty(context.ConnectionId))
            {
                await Clients.Client(context.ConnectionId).SendAsync("ReceiveFrame", data);
            }
            else
            {
                Console.WriteLine($"User {userId} not found.");
            }
        }

        public Task SetExerciseType(string userId, ExerciseType type)
        {
            if (_clients.TryGetValue(userId, out var context))
            {
                context.ExerciseType = type;
                Console.WriteLine($"Exercise type set for {userId}: {type}");
            }
            else
            {
                Console.WriteLine($"User {userId} not found.");
            }
            return Task.CompletedTask;
        }

        public async Task SendBatchToAI(string userId, string data)
        {
            if (_clients.TryGetValue(userId, out var context) && _aiConnectionId != null && context.ExerciseType != null)
            {
                await Clients.Client(_aiConnectionId).SendAsync("ReceiveBatch", userId, context.ExerciseType, data);
            }
            else if (_aiConnectionId == null)
            {
                Console.WriteLine("No AI client connected.");
            }
            else if (context.ExerciseType == null)
            {
                Console.WriteLine($"User {userId} hasn't choose a exercise type.");
            }
            else
            {
                Console.WriteLine($"User {userId} not found.");
            }
        }

        public async Task SendScore(string userId, float data)
        {
            if (_clients.TryGetValue(userId, out var context) && !string.IsNullOrEmpty(context.ConnectionId))
            {
                await Clients.Client(context.ConnectionId).SendAsync("ReceiveScore", data);
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
                _clients[userId] = new ClientContext { ConnectionId = Context.ConnectionId };
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
            var userId = _clients.FirstOrDefault(c => c.Value.ConnectionId == Context.ConnectionId).Key;
            if (!string.IsNullOrEmpty(userId))
            {
                _clients.Remove(userId, out var context);
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