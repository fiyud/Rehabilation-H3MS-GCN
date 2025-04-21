namespace KinectAppAPI
{
    public static class Constants
    {
        public const string GetAllUsers = "SELECT * FROM users";
        public const string GetUserById = "SELECT * FROM users WHERE id = @Id";
        public const string GetPatientsByDoctorId = "SELECT u.id, u.name, u.age, u.address, u.phone, e.type, e.score, e.duration, e.submitted_at FROM users u WHERE doctor_id = @DoctorId and role = 'Patient' join exercises e on e.patient_id = u.id";
        public const string AddUser = "INSERT INTO users (id, name, role, doctor_id, age, address, phone) VALUES (@Id, @Name, @Role, @DoctorId, @Age, @Address, @Phone)";
        public const string GetExercisesByPatientId = "SELECT * FROM exercises WHERE patient_id = @PatientId";
        public const string AddExercise = "INSERT INTO exercises (patient_id, type, score, duration) VALUES (@PatientId, @Type, @Score, @Duration)";
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
}
