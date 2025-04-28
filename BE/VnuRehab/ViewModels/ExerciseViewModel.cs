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
            new ExerciseItem { Group = "Kimore", Name = "Exercise1" },
            new ExerciseItem { Group = "Kimore", Name = "Exercise2" },
            new ExerciseItem { Group = "Kimore", Name = "Exercise3" },
            new ExerciseItem { Group = "Kimore", Name = "Exercise4" },
            new ExerciseItem { Group = "Kimore", Name = "Exercise5" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise6" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise7" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise8" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise9" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise10" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise11" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise12" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise13" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise14" },
            new ExerciseItem { Group = "UIPRMD", Name = "Exercise15" }
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
