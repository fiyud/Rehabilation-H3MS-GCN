using System;
using System.Collections.ObjectModel;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Threading;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class ExerciseViewModel : BaseViewModel
    {
        private DrawingImage _imageSource;
        private bool _isDeviceAvailable;
        private bool _isDeviceOpen;
        private decimal _score;
        private bool _isExerciseRunning;
        private TimeSpan _timeLeft = TimeSpan.FromMinutes(2); // Default 2 minutes
        private string _timeLeftText = "Time left: 2:00";
        private DispatcherTimer _exerciseTimer;
        private ExerciseItem _selectedExercise;

        public DrawingImage ImageSource
        {
            get => _imageSource;
            set => SetProperty(ref _imageSource, value);
        }
        public bool IsDeviceAvailable
        {
            get => _isDeviceAvailable;
            set => SetProperty(ref _isDeviceAvailable, value);
        }
        public bool IsDeviceOpen
        {
            get => _isDeviceOpen;
            set => SetProperty(ref _isDeviceOpen, value);
        }
        public decimal Score
        {
            get => _score;
            set => SetProperty(ref _score, value);
        }
        public bool IsExerciseRunning
        {
            get => _isExerciseRunning;
            set => SetProperty(ref _isExerciseRunning, value);
        }

        public string TimeLeftText
        {
            get => _timeLeftText;
            set => SetProperty(ref _timeLeftText, value);
        }

        public ExerciseItem SelectedExercise
        {
            get => _selectedExercise;
            set => SetProperty(ref _selectedExercise, value);
        }
        private bool _isDropDownOpen;
        public bool IsDropDownOpen
        {
            get => _isDropDownOpen;
            set => SetProperty(ref _isDropDownOpen, value);
        }
        public ObservableCollection<ExerciseItem> Exercises { get; set; } = new ObservableCollection<ExerciseItem>
        {
            new ExerciseItem { Group = "Kimore", Name = "Jumping Jacks" },
            new ExerciseItem { Group = "Kimore", Name = "Arm Circles" },
            new ExerciseItem { Group = "Kimore", Name = "Torso Twists" },
            new ExerciseItem { Group = "Kimore", Name = "Squats" },
            new ExerciseItem { Group = "Kimore", Name = "Lateral Arm Raises" },
            new ExerciseItem { Group = "UIPRMD", Name = "Deep Squat" },
            new ExerciseItem { Group = "UIPRMD", Name = "Hurdle Step" },
            new ExerciseItem { Group = "UIPRMD", Name = "Inline Lunge" },
            new ExerciseItem { Group = "UIPRMD", Name = "Side Lunge" },
            new ExerciseItem { Group = "UIPRMD", Name = "Sit to Stand" },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Active Straight Leg Raise" },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Abduction" },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Extension" },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Internal-External Rotation" },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Scaption" }
        };
        public KinectService KinectService => _kinectService;

        private readonly UserSessionService _userSessionService;
        private readonly KinectService _kinectService;
        private readonly SignalRService _signalRService;
        public ICommand ToggleDeviceCommand { get; }
        public ICommand ToggleExerciseCommand { get; }
        private bool _isTimerVisible = false;
        private bool _isScoreVisible = false;

        public bool IsTimerVisible
        {
            get => _isTimerVisible;
            set => SetProperty(ref _isTimerVisible, value);
        }

        public bool IsScoreVisible
        {
            get => _isScoreVisible;
            set => SetProperty(ref _isScoreVisible, value);
        }


        public ExerciseViewModel(UserSessionService userSessionService,
                                 KinectService kinectService,
                                 SignalRService signalRService)
        {
            _userSessionService = userSessionService;
            _kinectService = kinectService;
            _signalRService = signalRService;

            // Initialize timer
            _exerciseTimer = new DispatcherTimer();
            _exerciseTimer.Interval = TimeSpan.FromSeconds(1);
            _exerciseTimer.Tick += ExerciseTimer_Tick;


            _kinectService.FrameReady += image => ImageSource = image;
            _kinectService.BatchReady += async batch => await _signalRService.SendBatchAsync(batch);
            _signalRService.OnScoreReceived += (score) => Score = score;
            _kinectService.OnSensorAvailableChanged += (_, e) =>
            {
                IsDeviceAvailable = e.IsAvailable;
                if (!e.IsAvailable)
                {
                    ImageSource = null;
                }
            };
            _kinectService.OnSensorOpenChanged += (open) => IsDeviceOpen = open;

            IsDeviceAvailable = _kinectService.IsAvailable;
            IsDeviceOpen = _kinectService.IsOpen;
            ToggleDeviceCommand = new RelayCommand(_ => ToggleDevice());
            ToggleExerciseCommand = new RelayCommand(_ => ToggleExercise());
        }
        private void ExerciseTimer_Tick(object sender, EventArgs e)
        {
            if (_timeLeft > TimeSpan.Zero)
            {
                _timeLeft = _timeLeft.Subtract(TimeSpan.FromSeconds(1));
                TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00}";
            }
            else
            {
                // Time's up
                StopExercise();
            }
        }

        private void ToggleExercise()
        {
            if (IsExerciseRunning)
            {
                StopExercise();
            }
            else
            {
                StartExercise();
            }
        }

        //private void StartExercise()
        //{
        //    if (!IsDeviceOpen || SelectedExercise == null)
        //        return;

        //    // Reset timer
        //    _timeLeft = TimeSpan.FromMinutes(2);
        //    TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00}";

        //    // Start timer
        //    _exerciseTimer.Start();
        //    IsExerciseRunning = true;
        //}
        private void StartExercise()
        {
            // Check if exercise is selected
            if (SelectedExercise == null)
            {
                // Add user feedback for missing selection
                System.Windows.MessageBox.Show("Please select an exercise first.", "Exercise Required",
                    System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
                return;
            }

            // For testing without Kinect, allow exercise to start even if device isn't available
            if (!IsDeviceOpen)
            {
                // Optional: Show a warning but continue
                System.Windows.MessageBox.Show("Warning: Kinect device is not connected.",
                    "Device Not Connected", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Warning);
                return;
            }

            // Reset timer
            _timeLeft = TimeSpan.FromMinutes(2);
            TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00} seconds";

            // Show timer and score
            IsTimerVisible = true;
            IsScoreVisible = true;

            // Start timer
            _exerciseTimer.Start();
            IsExerciseRunning = true;   
        }

        private void StopExercise()
        {
            // Stop timer
            _exerciseTimer.Stop();
            IsExerciseRunning = false;

            // Hide timer and score
            IsTimerVisible = false;
            IsScoreVisible = false;

            // Reset time display
            _timeLeft = TimeSpan.FromMinutes(2);
            TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00} seconds";
        }

        private void ToggleDevice()
        {
            if (IsDeviceAvailable)
            {
                if (IsDeviceOpen)
                {
                    _kinectService.Stop();
                    ImageSource = null;
                }
                else
                {
                    _kinectService.Start();
                }
            }
        }
    }

    public class ExerciseItem
    {
        public string Group { get; set; }
        public string Name { get; set; }
    }
}
