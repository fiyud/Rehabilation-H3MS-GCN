using System.Collections.ObjectModel;
using System.Windows.Input;
using System.Windows.Media;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class ExerciseViewModel : BaseViewModel
    {
        private DrawingImage _imageSource;
        private bool _isDeviceAvailable;
        private bool _isDeviceOpen;
        private decimal _score;
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

        public ExerciseViewModel(UserSessionService userSessionService,
                                 KinectService kinectService,
                                 SignalRService signalRService)
        {
            _userSessionService = userSessionService;
            _kinectService = kinectService;
            _signalRService = signalRService;

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
