using KinectAppAPI;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(opts =>
{
    opts.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddSignalR(opts =>
{
    opts.EnableDetailedErrors = true;
    opts.MaximumReceiveMessageSize = 1024 * 1024 * 10; // 10 MB
});

var app = builder.Build();
app.UseCors();
app.MapHub<KinectHub>("/kinectHub");
app.Run();

namespace KinectAppAPI
{
    public class KinectHub : Hub
    {
        public async Task SendBatchToAI(string data)
        {
            await Clients.Group("AIClients").SendAsync("ReceiveBatch", data);
        }

        public async Task SendScore(float data)
        {
            await Clients.Group("UIClients").SendAsync("ReceiveScore", data);
        }

        public override Task OnConnectedAsync()
        {
            var clientType = Context.GetHttpContext()?.Request.Query["type"].ToString();
            if (clientType == "ui")
            {
                Groups.AddToGroupAsync(Context.ConnectionId, "UIClients").Wait();
                Console.WriteLine($"UI client connected: {Context.ConnectionId}");
            }
            else if (clientType == "ai")
            {
                Groups.AddToGroupAsync(Context.ConnectionId, "AIClients").Wait();
                Console.WriteLine($"AI client connected: {Context.ConnectionId}");
            } else
            {
                Console.WriteLine($"Client connected: {Context.ConnectionId}");
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            return base.OnDisconnectedAsync(exception);
        }
    }
}