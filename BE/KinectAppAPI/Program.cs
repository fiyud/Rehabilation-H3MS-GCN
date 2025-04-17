using KinectAppAPI;

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
builder.Services.AddScoped<IUserDataAccess, UserDataAccess>();

var app = builder.Build();
app.UseCors();

app.MapHub<KinectHub>("/kinectHub");

app.MapPost("/login", async (LoginRequest login, IUserDataAccess data) =>
{
    var user = await data.GetByIdAsync(login.Id);
    return user != null ? Results.Ok(new { message = "Login successfully", user }) : Results.Unauthorized();
});

app.Run();