using System.Collections.Generic;
using System.Windows.Media;
using System;
using Microsoft.Kinect;
using VnuRehab.Services;

namespace VnuRehab.ViewModels
{
    public class ExerciseViewModel : BaseViewModel
    {
        private const double HandSize = 30;
        private const double JointThickness = 3;
        private const double ClipBoundsThickness = 10;
        private const float InferredZPositionClamp = 0.1f;
        private readonly Brush _handClosedBrush = new SolidColorBrush(Color.FromArgb(128, 255, 0, 0));
        private readonly Brush _handOpenBrush = new SolidColorBrush(Color.FromArgb(128, 0, 255, 0));
        private readonly Brush _handLassoBrush = new SolidColorBrush(Color.FromArgb(128, 0, 0, 255));
        private readonly Brush _trackedJointBrush = new SolidColorBrush(Color.FromArgb(255, 68, 192, 68));
        private readonly Brush _inferredJointBrush = Brushes.Yellow;
        private readonly Pen _inferredBonePen = new Pen(Brushes.Gray, 1);
        private List<Pen> _bodyColors;
        private DrawingGroup _drawingGroup;
        private DrawingImage _imageSource;
        private string _statusText = null;
        public DrawingImage ImageSource
        {
            get => _imageSource;
        }
        public string StatusText
        {
            get => _statusText;
            set { _statusText = value; OnPropertyChanged(nameof(StatusText)); }
        }
        private readonly UserSessionService _userSessionService;
        private readonly KinectService _kinectService;

        public ExerciseViewModel(UserSessionService userSessionService)
        {
            _userSessionService = userSessionService;

            _bodyColors = new List<Pen>
            {
                new Pen(Brushes.Red, 6),
                new Pen(Brushes.Orange, 6),
                new Pen(Brushes.Green, 6),
                new Pen(Brushes.Blue, 6),
                new Pen(Brushes.Indigo, 6),
                new Pen(Brushes.Violet, 6)
            };

            _kinectService.Start();
            _kinectService.KinectSensor.IsAvailableChanged += KinectSensor_IsAvailableChanged;
        }

        private void KinectSensor_IsAvailableChanged(object sender, IsAvailableChangedEventArgs e)
        {
            StatusText = e.IsAvailable ? "Available" : "Unavailable";
        }
    }
}
