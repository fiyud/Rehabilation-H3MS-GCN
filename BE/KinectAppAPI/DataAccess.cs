using Dapper;
using MySql.Data.MySqlClient;

namespace KinectAppAPI;

public class DataAccess(IConfiguration configuration) : IDataAccess
{
    private readonly string _connectionString = configuration.GetConnectionString("MySQLConnection")!;

    private MySqlConnection GetConnection() => new(_connectionString);

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        using var conn = GetConnection();
        return await conn.QueryAsync<User>(Constants.GetAllUsers);
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        using var conn = GetConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(Constants.GetUserById, new { Id = id });
    }

    public async Task<bool> AddAsync(User user)
    {
        using var conn = GetConnection();
        var result = await conn.ExecuteAsync(Constants.AddUser, new
        {
            user.Id,
            user.Name,
            Role = user.Role.ToString(),
            user.DoctorId,
            user.Age,
            user.Address,
            user.Phone
        });
        return result > 0;
    }

    public async Task<IEnumerable<DoctorPatientResponse>> GetPatientsByDoctorIdAsync(string doctorId)
    {
        using var conn = GetConnection();
        var patientDict = new Dictionary<string, DoctorPatientResponse>();
        var result = await conn.QueryAsync<DoctorPatientResponse, ExerciseResponse, DoctorPatientResponse>(
            Constants.GetPatientsByDoctorId,
            (patient, exercise) =>
            {
                if (!patientDict.TryGetValue(patient.Id, out var entry))
                {
                    entry = new DoctorPatientResponse
                    {
                        Id = patient.Id,
                        Name = patient.Name,
                        Age = patient.Age,
                        Address = patient.Address,
                        Phone = patient.Phone,
                        Exercises = []
                    };
                    patientDict[patient.Id] = entry;
                }
                if (exercise?.Type != null)
                {
                    var exercises = patientDict[patient.Id].Exercises.ToList();
                    exercises.Add(exercise);
                    entry.Exercises = [.. exercises];
                    patientDict[patient.Id] = entry;
                }
                return entry;
            },
            new { DoctorId = doctorId },
            splitOn: "Type"
        );
        return patientDict.Values;
    }

    public async Task<IEnumerable<Exercise>> GetExerciseByPatientIdAsync(string patientId)
    {
        using var conn = GetConnection();
        return await conn.QueryAsync<Exercise>(Constants.GetExercisesByPatientId, new { PatientId = patientId });
    }

    public async Task<bool> AddExerciseAsync(Exercise exercise)
    {
        using var conn = GetConnection();
        var result = await conn.ExecuteAsync(Constants.AddExercise, new
        {
            exercise.PatientId,
            Type = exercise.Type.ToString(),
            exercise.Score,
            exercise.Duration
        });
        return result > 0;
    }
}