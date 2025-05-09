using System;

namespace VnuRehab.Models
{
    public class Exercise
    {
        public int Id { get; set; }
        public string PatientId { get; set; }
        public ExerciseType Type { get; set; }
        public decimal Score { get; set; }
        public decimal? Duration { get; set; } = 180.0m;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
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
}
