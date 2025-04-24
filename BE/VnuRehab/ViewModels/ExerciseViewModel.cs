using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Media;
using Microsoft.Kinect;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class ExerciseViewModel : BaseViewModel
    {
        private DrawingImage _imageSource;
        private string _statusText;
        private bool _isServicesConnected;
        public DrawingImage ImageSource
        {
            get => _imageSource;
            set { _imageSource = value; OnPropertyChanged(nameof(ImageSource)); }
        }
        public string StatusText
        {
            get => _statusText;
            set { _statusText = value; OnPropertyChanged(nameof(StatusText)); }
        }
        public bool IsServicesConnected
        {
            get => _isServicesConnected;
            set { _isServicesConnected = value; OnPropertyChanged(nameof(IsServicesConnected)); }
        }

        private readonly UserSessionService _userSessionService;
        private readonly KinectService _kinectService;
        private readonly SignalRService _signalRService;

        public ICommand ToggleServicesCommand { get; }

        public ExerciseViewModel(UserSessionService userSessionService,
                                 KinectService kinectService,
                                 SignalRService signalRService)
        {
            _userSessionService = userSessionService;
            _kinectService = kinectService;
            _signalRService = signalRService;

            _kinectService.FrameReady += image => ImageSource = image;
            _kinectService.BatchReady += async batch => await _signalRService.SendBatchAsync(batch);
            _kinectService.SensorAvailableChanged += KinectSensor_IsAvailableChanged;

            ToggleServicesCommand = new RelayCommand<object>(async _ => await ToggleServices());
        }

        private async Task ToggleServices()
        {
            if (IsServicesConnected)
            {
                await _signalRService.DisconnectAsync();
                _kinectService.Stop();
                IsServicesConnected = false;
            }
            else
            {
                _kinectService.Start();
                await _signalRService.ConnectAsync();
                IsServicesConnected = true;
            }
        }

        private void KinectSensor_IsAvailableChanged(object sender, IsAvailableChangedEventArgs e)
        {
            StatusText = e.IsAvailable ? "Available" : "Unavailable";
        }
    }
}
