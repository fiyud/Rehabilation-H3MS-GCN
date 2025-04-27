using System;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Media;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class ExerciseViewModel : BaseViewModel
    {
        private DrawingImage _imageSource;
        private bool _isServicesAvailable;
        private decimal _score;
        public DrawingImage ImageSource
        {
            get => _imageSource;
            set => SetProperty(ref _imageSource, value);
        }
        public bool IsServicesAvailable
        {
            get => _isServicesAvailable;
            set => SetProperty(ref _isServicesAvailable, value);
        }
        public decimal Score
        {
            get => _score;
            set => SetProperty(ref _score, value);
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
            _signalRService.OnScoreReceived += (score) => Score = score;
            _signalRService.OnConnectionChanged += ServiceAvailableChanged;
            _kinectService.OnSensorAvailableChanged += ServiceAvailableChanged;

            ToggleServicesCommand = new RelayCommand<object>(async _ => await ToggleServices());
        }

        private async Task ToggleServices()
        {
            if (IsServicesAvailable)
            {
                await _signalRService.DisconnectAsync();
                _kinectService.Stop();
                ImageSource = null;
                IsServicesAvailable = false;
            }
            else
            {
                _kinectService.Start();
                await _signalRService.ConnectAsync();
                IsServicesAvailable = true;
            }
        }

        private void ServiceAvailableChanged(object sender, EventArgs e)
        {
            IsServicesAvailable = _signalRService.IsConnected && _kinectService.IsAvailable;
        }
    }
}
