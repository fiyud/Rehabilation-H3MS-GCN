namespace KinectAppAPI
{
    public record LoginRequest(string Username, string Id);
    public record AddPatientRequest(string Id, string Name, int? Age, string? Address, string? Phone);
    public record AddExerciseRequest(ExerciseType Type, decimal Score, decimal? Duration);
    public record DoctorPatientResponse(
        string Id, 
        string Name, 
        int Age, 
        string Address, 
        string Phone, 
        ExerciseType Type, 
        decimal Score, 
        decimal Duration, 
        DateTime SubmittedAt);

    public enum Role { Doctor, Patient }
    public class User
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required Role Role { get; set; } = Role.Patient;

        public string? DoctorId { get; set; }
        public int? Age { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
    }

    public enum ExerciseType
    {
        Kimore_JumpingJacks,
        Kimore_ArmCircles,
        Kimore_TorsoTwists,
        Kimore_Squats,
        Kimore_LateralArmRaises,
        UIPRMD_DeepSquat,
        UIPRMD_HurdleStep,
        UIPRMD_InlineLunge,
        UIPRMD_SideLunge,
        UIPRMD_SitToStand,
        UIPRMD_StandingActiveStraightLegRaise,
        UIPRMD_StandingShoulderAbduction,
        UIPRMD_StandingShoulderExtension,
        UIPRMD_StandingShoulderInternalExternalRotation,
        UIPRMD_StandingShoulderScaption,
    }

    public class Exercise
    {
        public int Id { get; set; }
        public required string PatientId { get; set; }
        public required ExerciseType Type { get; set; }
        public required decimal Score { get; set; }
        public decimal? Duration { get; set; } = 180.0m;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
