using System.Security.Claims;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Json;
using VnuRehabAPI;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(opts =>
{
    opts.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.Configure<JsonOptions>(opts => opts.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddSignalR(opts =>
{
    opts.EnableDetailedErrors = true;
    opts.MaximumReceiveMessageSize = 1024 * 1024 * 10; // 10 MB
});
builder.Services.AddScoped<IDataAccess, DataAccess>();
builder.Services.AddAuthentication("SimpleToken")
                .AddScheme<AuthenticationSchemeOptions, AuthHandler>("SimpleToken", null);
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapHub<KinectHub>("/kinecthub");

app.MapGet("/test", async (IDataAccess data) =>
{
    var users = await data.GetAllAsync();
    return users.Any() ? Results.Ok(users) : Results.NotFound();
});

app.MapPost("/login", async (LoginRequest login, IDataAccess data) =>
{
    var user = await data.GetByIdAsync(login.Id);
    return user != null ? Results.Ok(user) : Results.Unauthorized();
});

app.MapGet("/patients", async (HttpContext context, IDataAccess data) =>
{
    var doctorId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (doctorId == null) return Results.Unauthorized();
    var patients = await data.GetPatientsByDoctorIdAsync(doctorId);
    return patients.Any() ? Results.Ok(patients) : Results.NotFound();
}).RequireAuthorization(policy => policy.RequireRole(Role.Doctor.ToString()));

app.MapPost("/patients", async (AddPatientRequest req, HttpContext context, IDataAccess data) =>
{
    var doctorId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (doctorId == null) return Results.Unauthorized();
    return await data.AddAsync(new User
    {
        Id = req.Id,
        Name = req.Name,
        Role = Role.Patient,
        DoctorId = doctorId,
        Age = req.Age,
        Address = req.Address,
        Phone = req.Phone,
    }) ? Results.Created() : Results.BadRequest();
}).RequireAuthorization(policy => policy.RequireRole(Role.Doctor.ToString()));

app.MapGet("/exercises", async (HttpContext context, IDataAccess data) =>
{
    var patientId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (patientId == null) return Results.Unauthorized();
    var exercises = await data.GetExerciseByPatientIdAsync(patientId);
    return exercises.Any() ? Results.Ok(exercises) : Results.NotFound();
}).RequireAuthorization(policy => policy.RequireRole(Role.Patient.ToString()));

app.MapPost("/exercises", async (AddExerciseRequest req, HttpContext context, IDataAccess data) =>
{
    var patientId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (patientId == null) return Results.Unauthorized();
    return await data.AddExerciseAsync(new Exercise
    {
        PatientId = patientId,
        Type = req.Type,
        Score = req.Score,
        Duration = req.Duration ?? 180.0m,
    }) ? Results.Created() : Results.BadRequest();
}).RequireAuthorization(policy => policy.RequireRole(Role.Patient.ToString()));

app.Run();