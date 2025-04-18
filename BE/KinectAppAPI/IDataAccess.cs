namespace KinectAppAPI
{
    public static class Constants
    {
        public const string GetAllUsers = "SELECT * FROM users";
        public const string GetUserById = "SELECT * FROM users WHERE id = @Id";
        public const string GetPatientsByDoctorId = "SELECT * FROM users WHERE doctor_id = @DoctorId and role = 'Patient'";
        public const string AddUser = "INSERT INTO users (id, name, role, doctor_id, age, address, phone) VALUES (@Id, @Name, @Role, @DoctorId, @Age, @Address, @Phone)";
        public const string GetExercisesByPatientId = "SELECT * FROM exercises WHERE patient_id = @PatientId";
        public const string AddExercise = "INSERT INTO exercises (patient_id, type, score) VALUES (@PatientId, @Type, @Score)";
    }

    public interface IDataAccess
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(string id);
        Task<bool> AddAsync(User user);
        Task<IEnumerable<User>> GetPatientsByDoctorIdAsync(string doctorId);
        Task<IEnumerable<Exercise>> GetExerciseByPatientIdAsync(string patientId);
        Task<bool> AddExerciseAsync(Exercise exercise);
    }
}
