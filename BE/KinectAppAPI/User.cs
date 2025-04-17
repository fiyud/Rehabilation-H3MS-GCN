namespace KinectAppAPI
{
    public record LoginRequest(string Username, string Id);
    public class User
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
    }

    public class Patient : User
    {
        public int Age { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
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
        public ExerciseType Type { get; set; }
        public float Score { get; set; }
    }
}
