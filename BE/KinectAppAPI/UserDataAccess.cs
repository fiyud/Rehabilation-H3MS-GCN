using Dapper;
using MySql.Data.MySqlClient;

namespace KinectAppAPI
{
    public class UserDataAccess(IConfiguration configuration) : IUserDataAccess
    {
        private readonly string _connectionString = configuration.GetConnectionString("MySQLConnection")!;

        private MySqlConnection GetConnection() => new(_connectionString);
        
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            using var conn = GetConnection();
            return await conn.QueryAsync<User>("SELECT * FROM users");
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            using var conn = GetConnection();
            return await conn.QueryFirstOrDefaultAsync<User>("SELECT * FROM users WHERE id = @Id", new { Id = id });
        }
        
        public async Task<bool> AddAsync(User user)
        {
            using var conn = GetConnection();
            var result = await conn.ExecuteAsync("INSERT INTO users (id, name) VALUES (@Id, @Name)", user);
            return result > 0;
        }

        public async Task<bool> UpdateAsync(string id, User user)
        {
            using var conn = GetConnection();
            var result = await conn.ExecuteAsync("UPDATE users SET name = @Name WHERE id = @Id", new { Id = id, user.Name });
            return result > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            using var conn = GetConnection();
            var result = await conn.ExecuteAsync("DELETE FROM users WHERE id = @Id", new { Id = id });
            return result > 0;
        }
    }
}
