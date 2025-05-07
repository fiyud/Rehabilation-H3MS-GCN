using System;
using System.Windows;
using System.Windows.Threading;
using System.Collections.Generic;
using System.Windows.Input;
using System.Windows.Media;
using VnuRehab.Models;
using VnuRehab.Services;
using System.Threading.Tasks;

namespace VnuRehab.ViewModels
{
    public class ExerciseViewModel : BaseViewModel
    {
        private DrawingImage _imageSource;
        public DrawingImage ImageSource { get => _imageSource; set => SetProperty(ref _imageSource, value); }

        private bool _isDeviceAvailable;
        public bool IsDeviceAvailable { get => _isDeviceAvailable; set => SetProperty(ref _isDeviceAvailable, value); }

        private bool _isDeviceOpen;
        public bool IsDeviceOpen { get => _isDeviceOpen; set => SetProperty(ref _isDeviceOpen, value); }

        private bool _isServerConnected;
        public bool IsServerConnected { get => _isServerConnected; set => SetProperty(ref _isServerConnected, value); }

        private decimal _score;
        public decimal Score { get => _score; set => SetProperty(ref _score, value); }

        private bool _isExerciseRunning;
        public bool IsExerciseRunning { get => _isExerciseRunning; set => SetProperty(ref _isExerciseRunning, value); }

        private readonly DispatcherTimer _exerciseTimer;
        private static readonly TimeSpan ExerciseDuration = TimeSpan.FromMinutes(2); // Default 2 minutes
        private TimeSpan _timeLeft = ExerciseDuration;
        private string _timeLeftText = "Time left: 2:00 seconds";
        public string TimeLeftText { get => _timeLeftText; set => SetProperty(ref _timeLeftText, value); }

        private double _timerProgress = 1.0; // New property for timer progress (1.0 = 100%)
        public double TimerProgress { get => _timerProgress; set => SetProperty(ref _timerProgress, value); }

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
        private ExerciseType _selectedExercise;
        public ExerciseType SelectedExercise { get => _selectedExercise; set => SetProperty(ref _selectedExercise, value); }

        private readonly KinectService _kinectService;
        private readonly SignalRService _signalRService;
        public ICommand ToggleDeviceCommand { get; }
        public ICommand ToggleExerciseCommand { get; }
        public ICommand ResetCommand { get; }
        
        private bool _isPopupVisible;
        public bool IsPopupVisible { get => _isPopupVisible; set => SetProperty(ref _isPopupVisible, value); }
        
        private string _timeTakenText;
        public string TimeTakenText { get => _timeTakenText; set => SetProperty(ref _timeTakenText, value); }

        public ExerciseViewModel(KinectService kinectService, SignalRService signalRService)
        {
            _kinectService = kinectService;
            _signalRService = signalRService;

            _exerciseTimer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(1) };
            _exerciseTimer.Tick += ExerciseTimer_Tick;


            _kinectService.FrameReady += image => ImageSource = image;
            _kinectService.BatchReady += async batch => await _signalRService.SendBatchAsync(batch, SelectedExercise);
            _kinectService.OnSensorAvailableChanged += (_, e) =>
            {
                IsDeviceAvailable = e.IsAvailable;
                if (!e.IsAvailable) ImageSource = null;
            };
            _kinectService.OnSensorOpenChanged += (open) => IsDeviceOpen = open;
            _signalRService.OnScoreReceived += (score) => Score = score;
            _signalRService.OnConnectionChanged += (s, connected) => IsServerConnected = connected;

            IsDeviceAvailable = _kinectService.IsAvailable;
            IsDeviceOpen = _kinectService.IsOpen;
            ToggleDeviceCommand = new RelayCommand(_ => ToggleDevice());
            ToggleExerciseCommand = new RelayCommand(async _ => await ToggleExercise());
            ResetCommand = new RelayCommand(async _ => await ResetSession());
        }

        private async Task ResetSession()
        {
            // Reset all exercise data
            await StopExercise();
            Score = 0;
            TimeTakenText = string.Empty;

            // Hide the popup
            IsPopupVisible = false;
        }
        private async void ExerciseTimer_Tick(object sender, EventArgs e)
        {
            if (_timeLeft > TimeSpan.Zero)
            {
                _timeLeft = _timeLeft.Subtract(TimeSpan.FromSeconds(1));
                TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00} seconds";
                TimerProgress = _timeLeft.TotalSeconds / ExerciseDuration.TotalSeconds;
            }
            else
            {
                await StopExercise();
            }
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

        private async Task ToggleExercise()
        {
            if (IsExerciseRunning)
            {
                await StopExercise();
            }
            else
            {
                await StartExercise();
            }
        }

        private async Task StartExercise()
        {
            if (!IsDeviceOpen)
            {
                MessageBox.Show("Warning: Kinect device is not connected or not turned on.", "Device Not Connected", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            await _signalRService.ConnectAsync();
            if (!_signalRService.IsConnected) return;

            // Reset timer
            _timeLeft = ExerciseDuration;
            TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00} seconds";
            TimerProgress = 1.0;

            // Start timer
            _exerciseTimer.Start();
            IsExerciseRunning = true;   
        }

        private async Task StopExercise()
        {
            await _signalRService.DisconnectAsync();
            // Stop timer
            _exerciseTimer.Stop();
            IsExerciseRunning = false;

            // Calculate time taken
            TimeSpan totalDuration = ExerciseDuration;
            TimeSpan timeTaken = totalDuration - _timeLeft;
            TimeTakenText = $"Time taken: {timeTaken.Minutes}:{timeTaken.Seconds:00}";

            // Show the popup
            IsPopupVisible = true;
            // Reset time display
            _timeLeft = ExerciseDuration;
            TimeLeftText = $"Time left: {_timeLeft.Minutes}:{_timeLeft.Seconds:00} seconds";
            TimerProgress = 1.0;
        }
    }

    public class ExerciseItem
    {
        public string Group { get; set; }
        public string Name { get; set; }
        public ExerciseType Value { get; set; }
    }
}