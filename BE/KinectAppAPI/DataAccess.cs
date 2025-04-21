using Dapper;
using MySql.Data.MySqlClient;

namespace KinectAppAPI
{
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
            return await conn.QueryAsync<DoctorPatientResponse>(Constants.GetPatientsByDoctorId, new { DoctorId = doctorId });
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
}
