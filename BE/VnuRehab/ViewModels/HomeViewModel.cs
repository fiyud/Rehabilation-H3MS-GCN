using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Windows.Input;
namespace VnuRehab.ViewModels
{
    public class HomeViewModel : BaseViewModel
    {
        private ObservableCollection<ExerciseData> _prmdExercises;
        private ObservableCollection<ExerciseData> _kimoreExercises;
        private bool _isPrmdVisible = true;
        private bool _isKimoreVisible = false;
        private string _currentVideoUrl; 
        public ObservableCollection<ExerciseData> PrmdExercises
        {
            get => _prmdExercises;
            set => SetProperty(ref _prmdExercises, value);
        }

        public ObservableCollection<ExerciseData> KimoreExercises
        {
            get => _kimoreExercises;
            set => SetProperty(ref _kimoreExercises, value);
        }

        public bool IsPrmdVisible
        {
            get => _isPrmdVisible;
            set => SetProperty(ref _isPrmdVisible, value);
        }

        public bool IsKimoreVisible
        {
            get => _isKimoreVisible;
            set => SetProperty(ref _isKimoreVisible, value);
        }
    

        public string CurrentVideoUrl
        {
            get => _currentVideoUrl;
            set => SetProperty(ref _currentVideoUrl, value);
        }

        public ICommand ToggleExerciseTypeCommand { get; }
        public ICommand OpenVideoCommand { get; }
        public HomeViewModel()
        {
            // Initialize PRMD exercises
            _prmdExercises = new ObservableCollection<ExerciseData>
            {
                new ExerciseData
                {
                    Id = 1,
                    Name = "Deep Squat",
                    VideoUrl = ExerciseVideos.DeepSquat,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with feet shoulder-width apart",
                        "2. Toes pointing slightly outward",
                        "3. Lower your body by bending your knees and hips",
                        "4. Keep your chest up and back straight",
                        "5. Go as low as you can while maintaining proper form",
                        "6. Return to starting position by pushing through your heels"
                    },
                    Tips = "Keep your knees aligned with your toes and maintain a neutral spine throughout the movement."
                },
                new ExerciseData
                {
                    Id = 2,
                    Name = "Hurdle Step",
                    VideoUrl = ExerciseVideos.HurdleStep,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with feet hip-width apart",
                        "2. Place a hurdle or object at knee height",
                        "3. Lift one leg and step over the hurdle",
                        "4. Keep your standing leg stable",
                        "5. Step down with control on the other side",
                        "6. Return to starting position and repeat with other leg"
                    },
                    Tips = "Maintain balance and control throughout the movement. Keep your core engaged."
                },
                new ExerciseData
                {
                    Id = 3,
                    Name = "Inline Lunge",
                    VideoUrl = ExerciseVideos.InlineLunge,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with feet together",
                        "2. Step one foot backward in a straight line",
                        "3. Lower your back knee toward the ground",
                        "4. Keep your front knee aligned with your ankle",
                        "5. Push through your front foot to return to start",
                        "6. Repeat with other leg"
                    },
                    Tips = "Keep your torso upright and maintain balance throughout the movement."
                },
                new ExerciseData
                {
                    Id = 4,
                    Name = "Side Lunge",
                    VideoUrl = ExerciseVideos.SideLunge,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with feet together",
                        "2. Step one foot to the side",
                        "3. Bend the stepping leg's knee",
                        "4. Keep the other leg straight",
                        "5. Push back to starting position",
                        "6. Repeat on other side"
                    },
                    Tips = "Keep your chest up and maintain proper knee alignment over your toes."
                },
                new ExerciseData
                {
                    Id = 5,
                    Name = "Sit to Stand",
                    VideoUrl = ExerciseVideos.SitToStand,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Start seated in a chair",
                        "2. Place feet shoulder-width apart",
                        "3. Lean slightly forward",
                        "4. Push through your heels to stand",
                        "5. Keep your back straight",
                        "6. Lower back down with control"
                    },
                    Tips = "Use your leg muscles to power the movement, not momentum."
                },
                new ExerciseData
                {
                    Id = 6,
                    Name = "Standing Active Straight Leg Raise",
                    VideoUrl = ExerciseVideos.StandingActiveStraightLegRaise,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand on one leg",
                        "2. Keep standing leg slightly bent",
                        "3. Lift other leg straight in front",
                        "4. Keep your back straight",
                        "5. Hold briefly at the top",
                        "6. Lower with control"
                    },
                    Tips = "Maintain balance and keep your core engaged throughout."
                },
                new ExerciseData
                {
                    Id = 7,
                    Name = "Standing Shoulder Abduction",
                    VideoUrl = ExerciseVideos.StandingShoulderAbduction,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with arms at sides",
                        "2. Raise arms out to the sides",
                        "3. Keep elbows straight",
                        "4. Raise to shoulder height",
                        "5. Hold briefly",
                        "6. Lower with control"
                    },
                    Tips = "Keep your shoulders down and away from your ears."
                },
                new ExerciseData
                {
                    Id = 8,
                    Name = "Standing Shoulder Extension",
                    VideoUrl = ExerciseVideos.StandingShoulderExtension,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with arms raised forward",
                        "2. Keep elbows straight",
                        "3. Move arms backward",
                        "4. Keep your chest up",
                        "5. Hold briefly",
                        "6. Return to start"
                    },
                    Tips = "Maintain proper posture and control throughout the movement."
                },
                new ExerciseData
                {
                    Id = 9,
                    Name = "Standing Shoulder Internal-External Rotation",
                    VideoUrl = ExerciseVideos.StandingShoulderInternalExternalRotation,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with elbow bent at 90 degrees",
                        "2. Keep elbow at your side",
                        "3. Rotate arm inward",
                        "4. Then rotate outward",
                        "5. Keep your wrist straight",
                        "6. Repeat for desired reps"
                    },
                    Tips = "Keep your elbow stable at your side throughout the rotation."
                },
                new ExerciseData
                {
                    Id = 10,
                    Name = "Standing Shoulder Scaption",
                    VideoUrl = ExerciseVideos.StandingShoulderScaption,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with arms at sides",
                        "2. Raise arms at 45-degree angle",
                        "3. Keep thumbs pointing up",
                        "4. Raise to shoulder height",
                        "5. Hold briefly",
                        "6. Lower with control"
                    },
                    Tips = "Keep your shoulders down and maintain proper form throughout."
                }
            };

            // Initialize KIMORE exercises
            _kimoreExercises = new ObservableCollection<ExerciseData>
            {
                new ExerciseData
                {
                    Id = 11,
                    Name = "Jumping Jacks",
                    VideoUrl = ExerciseVideos.JumpingJacks,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand upright with feet together and arms at your sides",
                        "2. Jump while spreading your legs shoulder-width apart",
                        "3. Simultaneously raise your arms overhead",
                        "4. Jump again to return to the starting position",
                        "5. Repeat at a steady pace"
                    },
                    Tips = "Maintain a consistent rhythm and land softly on your feet to avoid joint strain."
                },
                new ExerciseData
                {
                    Id = 12,
                    Name = "Arm Circles",
                    VideoUrl = ExerciseVideos.ArmCircles,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with feet shoulder-width apart",
                        "2. Extend both arms out to the sides at shoulder height",
                        "3. Start making small forward circles with your arms",
                        "4. Gradually increase the size of the circles",
                        "5. Reverse the direction after a set time"
                    },
                    Tips = "Keep your arms straight and engage your shoulders for maximum benefit."
                },
                new ExerciseData
                {
                    Id = 13,
                    Name = "Torso Twists",
                    VideoUrl = ExerciseVideos.TorsoTwists,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with feet hip-width apart",
                        "2. Bend your elbows and place hands in front of you",
                        "3. Twist your upper body to the left while keeping hips stable",
                        "4. Return to center and twist to the right",
                        "5. Continue alternating sides"
                    },
                    Tips = "Engage your core and avoid moving your hips for an effective twist."
                },
                new ExerciseData
                {
                    Id = 14,
                    Name = "Squats",
                    VideoUrl = ExerciseVideos.Squats,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with feet shoulder-width apart",
                        "2. Keep your chest up and back straight",
                        "3. Bend your knees and hips to lower down",
                        "4. Lower as if sitting into a chair",
                        "5. Push through your heels to return to standing"
                    },
                    Tips = "Keep your knees aligned with your toes and avoid leaning too far forward."
                },
                new ExerciseData
                {
                    Id = 15,
                    Name = "Lateral Arm Raises",
                    VideoUrl = ExerciseVideos.LateralArmRaises,
                    Instructions = new ObservableCollection<string>
                    {
                        "1. Stand with arms at your sides",
                        "2. Raise both arms out to the sides until shoulder height",
                        "3. Pause briefly at the top",
                        "4. Lower arms back down with control",
                        "5. Repeat for desired repetitions"
                    },
                    Tips = "Avoid shrugging your shoulders and use light weights if needed for better form."
                }
            };

            // Initialize command for toggling between exercise types
            ToggleExerciseTypeCommand = new RelayCommand<string>(ToggleExerciseType);
            OpenVideoCommand = new RelayCommand<string>(OpenVideo);
        }
        private void OpenVideo(string videoUrl)
        {
            // MODIFIED: Switched from modal approach to browser approach

            // Use regular YouTube URL instead of embed URL for opening in browser
            string watchUrl = videoUrl;

            // Convert from embed URL to regular YouTube URL if needed
            if (videoUrl.Contains("embed/"))
            {
                // Extract video ID from embed URL
                int startIndex = videoUrl.IndexOf("embed/") + 6;
                int endIndex = videoUrl.IndexOf("?", startIndex);
                string videoId = endIndex > startIndex
                    ? videoUrl.Substring(startIndex, endIndex - startIndex)
                    : videoUrl.Substring(startIndex);

                // Create regular YouTube URL
                watchUrl = $"https://www.youtube.com/watch?v={videoId}";
            }

            // Open in browser
            Process.Start(new ProcessStartInfo
            {
                FileName = watchUrl,
                UseShellExecute = true
            });

          
        }

        private void ToggleExerciseType(string exerciseType)
        {
            if (exerciseType == "PRMD")
            {
                IsPrmdVisible = true;
                IsKimoreVisible = false;
            }
            else
            {
                IsPrmdVisible = false;
                IsKimoreVisible = true;
            }
        }
    }

     public class ExerciseData
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string VideoUrl { get; set; }
    public ObservableCollection<string> Instructions { get; set; }
    public string Tips { get; set; }
}


// This is a placeholder class for ExerciseVideos reference
// Should be replaced with your actual ExerciseVideos static class
public static class ExerciseVideos
{
    public static string DeepSquat => "https://www.youtube.com/embed/bjV07PRoGGo?si=-4JXc2T9eITgqAnJ";
    public static string HurdleStep => "https://www.youtube.com/embed/U-n_Ar3RcLk?si=JzjUaz9H2bX-nS8v";
    public static string InlineLunge => "https://www.youtube.com/embed/gNm2Nkc4_o0?si=ahBPvS3wjuEEbkme";
    public static string SideLunge => "https://www.youtube.com/embed/URQvRQT0XMA?si=6c_NimLz4f5b8KHK";
    public static string SitToStand => "https://www.youtube.com/embed/eutszbtbJM8?si=J0GUkTHX1_K4lqHx";
    public static string StandingActiveStraightLegRaise => "https://www.youtube.com/embed/hB2n_pPw_aY?si=88jJMapos8CqqpK_";
    public static string StandingShoulderAbduction => "https://www.youtube.com/embed/ah4ckpaWd-Y?si=_-CoYsOj_VKDW2v3";
    public static string StandingShoulderExtension => "https://www.youtube.com/embed/EDQMlxrAHb0?si=uSN-a2cSPHPXW7eu";
    public static string StandingShoulderInternalExternalRotation => "https://www.youtube.com/embed/8zJtj0Bw6D0?si=yuGUl1MWnMUFIr2V";
    public static string StandingShoulderScaption => "https://www.youtube.com/embed/mPulP1J7QOw?si=2OCISBEqC-KSPAMF";
    public static string JumpingJacks => "https://www.youtube.com/embed/uLVt6u15L98?si=lveFuhFng2HiQNMf";
    public static string ArmCircles => "https://www.youtube.com/embed/UVMEnIaY8aU?si=ejJhQOVDlDnoxHGa";
    public static string TorsoTwists => "https://www.youtube.com/embed/HMKbmG1L7vc?si=hSLGU2wCoqtOYg7F";
    public static string Squats => "https://www.youtube.com/embed/YaXPRqUwItQ?si=vSuYqu6ayIyNU1-v";
    public static string LateralArmRaises => "https://www.youtube.com/embed/XPPfnSEATJA?si=7EZU-MuQekcizUFQ";
}
}
