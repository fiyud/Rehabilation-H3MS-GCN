namespace VnuRehabAPI;

public static class Constants
{
    public const string GetAllUsers = "SELECT * FROM users";
    public const string GetUserById = "SELECT * FROM users WHERE Id = @Id";
    public const string GetPatientsByDoctorId = "SELECT u.Id, u.Name, u.Age, u.Address, u.Phone, e.Type, e.Score, e.Duration, e.SubmittedAt FROM users u LEFT JOIN exercises e on e.PatientId = u.Id WHERE u.DoctorId = @DoctorId and u.Role = 'Patient' ORDER BY u.Id";
    public const string AddUser = "INSERT INTO users (Id, Name, Role, DoctorId, Age, Address, Phone) VALUES (@Id, @Name, @Role, @DoctorId, @Age, @Address, @Phone)";
    public const string GetExercisesByPatientId = "SELECT * FROM exercises WHERE PatientId = @PatientId";
    public const string AddExercise = "INSERT INTO exercises (PatientId, Type, Score, Duration) VALUES (@PatientId, @Type, @Score, @Duration)";
}

public interface IDataAccess
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(string id);
    Task<bool> AddAsync(User user);
    Task<IEnumerable<DoctorPatientResponse>> GetPatientsByDoctorIdAsync(string doctorId);
    Task<IEnumerable<Exercise>> GetExerciseByPatientIdAsync(string patientId);
    Task<bool> AddExerciseAsync(Exercise exercise);
}