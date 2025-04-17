namespace KinectAppAPI
{
    public interface IUserDataAccess
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(string id);
        Task<bool> AddAsync(User user);
        Task<bool> UpdateAsync(string id, User user);
        Task<bool> DeleteAsync(string id);
    }
}
