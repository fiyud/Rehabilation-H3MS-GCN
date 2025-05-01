using System;
using System.Windows.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Media;
using VnuRehab.Models;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class ExerciseViewModel : BaseViewModel
    {
        private DrawingImage _imageSource;
        private bool _isDeviceAvailable;
        private bool _isDeviceOpen;
        private bool _isServerConnected;
        private decimal _score;
        private bool _isExerciseRunning;
        private TimeSpan _timeLeft = TimeSpan.FromMinutes(2); // Default 2 minutes
        private string _timeLeftText = "Time left: 2:00 seconds";
        private DispatcherTimer _exerciseTimer;
        private ExerciseType _selectedExercise;
        private double _timerProgress = 1.0; // New property for timer progress (1.0 = 100%)

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
        public double TimerProgress
        {
            get => _timerProgress;
            set => SetProperty(ref _timerProgress, value);
        }

        public DrawingImage ImageSource { get => _imageSource; set => SetProperty(ref _imageSource, value); }
        public bool IsDeviceAvailable { get => _isDeviceAvailable; set => SetProperty(ref _isDeviceAvailable, value); }
        public bool IsDeviceOpen { get => _isDeviceOpen; set => SetProperty(ref _isDeviceOpen, value); }
        public bool IsServerConnected { get => _isServerConnected; set => SetProperty(ref _isServerConnected, value); }
        public decimal Score { get => _score; set => SetProperty(ref _score, value); }

        public List<ExerciseItem> Exercises { get; } = new List<ExerciseItem>
        {
            new ExerciseItem { Group = "Kimore", Name = "Jumping Jacks", Value = ExerciseType.Kimore_JumpingJacks },
            new ExerciseItem { Group = "Kimore", Name = "Arm Circles", Value = ExerciseType.Kimore_ArmCircles },
            new ExerciseItem { Group = "Kimore", Name = "Torso Twists", Value = ExerciseType.Kimore_TorsoTwists },
            new ExerciseItem { Group = "Kimore", Name = "Squats", Value = ExerciseType.Kimore_Squats },
            new ExerciseItem { Group = "Kimore", Name = "Lateral Arm Raises", Value = ExerciseType.Kimore_LateralArmRaises },
            new ExerciseItem { Group = "UIPRMD", Name = "Deep Squat", Value = ExerciseType.UIPRMD_DeepSquat },
            new ExerciseItem { Group = "UIPRMD", Name = "Hurdle Step", Value = ExerciseType.UIPRMD_HurdleStep },
            new ExerciseItem { Group = "UIPRMD", Name = "Inline Lunge", Value = ExerciseType.UIPRMD_InlineLunge },
            new ExerciseItem { Group = "UIPRMD", Name = "Side Lunge", Value = ExerciseType.UIPRMD_SideLunge },
            new ExerciseItem { Group = "UIPRMD", Name = "Sit to Stand", Value = ExerciseType.UIPRMD_SitToStand },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Active Straight Leg Raise", Value = ExerciseType.UIPRMD_StandingActiveStraightLegRaise },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Abduction", Value = ExerciseType.UIPRMD_StandingShoulderAbduction },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Extension", Value = ExerciseType.UIPRMD_StandingShoulderExtension },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Internal-External Rotation", Value = ExerciseType.UIPRMD_StandingShoulderInternalExternalRotation },
            new ExerciseItem { Group = "UIPRMD", Name = "Standing Shoulder Scaption", Value = ExerciseType.UIPRMD_StandingShoulderScaption }
        };
        public ExerciseType SelectedExercise { get => _selectedExercise; set => SetProperty(ref _selectedExercise, value); }

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

        public ExerciseViewModel(KinectService kinectService, SignalRService signalRService)
        {
            _kinectService = kinectService;
            _signalRService = signalRService;

            // Initialize timer
            _exerciseTimer = new DispatcherTimer();
            _exerciseTimer.Interval = TimeSpan.FromSeconds(1);
            _exerciseTimer.Tick += ExerciseTimer_Tick;


            _kinectService.FrameReady += image => ImageSource = image;
            _kinectService.BatchReady += async batch => await _signalRService.SendBatchAsync(batch, SelectedExercise);
            _kinectService.OnSensorAvailableChanged += (_, e) =>
            {
                IsDeviceAvailable = e.IsAvailable;
                if (!e.IsAvailable)
                {
                    ImageSource = null;
                }
            };
            _kinectService.OnSensorOpenChanged += (open) => IsDeviceOpen = open;
            _signalRService.OnScoreReceived += (score) => Score = score;
            _signalRService.OnConnectionChanged += (s, connected) => IsServerConnected = connected;

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
                TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00} seconds";
                TimerProgress = _timeLeft.TotalSeconds / 120.0;
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
            // For testing without Kinect, allow exercise to start even if device isn't available
            if (!IsDeviceOpen)
            {
                // Optional: Show a warning but continue
                System.Windows.MessageBox.Show("Warning: Kinect device is not connected.",
                    "Device Not Connected", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Warning);
            }

            // Reset timer
            _timeLeft = TimeSpan.FromMinutes(2);
            TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00} seconds";
            TimerProgress = 1.0;
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
            TimerProgress = 1.0;
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
        public ExerciseType Value { get; set; }
    }
}