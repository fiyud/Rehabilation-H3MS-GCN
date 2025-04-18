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
            var result = await conn.ExecuteAsync(Constants.AddUser, user);
            return result > 0;
        }

        public async Task<IEnumerable<User>> GetPatientsByDoctorIdAsync(string doctorId)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<User>(Constants.GetPatientsByDoctorId, new { DoctorId = doctorId });
        }

        public async Task<IEnumerable<Exercise>> GetExerciseByPatientIdAsync(string patientId)
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<Exercise>(Constants.GetExercisesByPatientId, new { PatientId = patientId });
        }

        public async Task<bool> AddExerciseAsync(Exercise exercise)
        {
            using var conn = GetConnection();
            var result = await conn.ExecuteAsync(Constants.AddExercise, exercise);
            return result > 0;
        }
    }
}
