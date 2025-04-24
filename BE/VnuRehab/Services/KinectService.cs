using System;
using System.Linq;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using Microsoft.Kinect;
using VnuRehab.Models;

namespace VnuRehab.Services
{
    public class KinectService : IDisposable
    {
        private const int FrameThreshold = 50;
        private const double HandSize = 30;
        private const double JointThickness = 3;
        private const float InferredZPositionClamp = 0.1f;
        private readonly Brush _handClosedBrush = new SolidColorBrush(Color.FromArgb(128, 255, 0, 0));
        private readonly Brush _handOpenBrush = new SolidColorBrush(Color.FromArgb(128, 0, 255, 0));
        private readonly Brush _handLassoBrush = new SolidColorBrush(Color.FromArgb(128, 0, 0, 255));
        private readonly Brush _trackedJointBrush = new SolidColorBrush(Color.FromArgb(255, 68, 192, 68));
        private readonly Brush _inferredJointBrush = Brushes.Yellow;
        private readonly Pen _inferredBonePen = new Pen(Brushes.Gray, 1);
        private readonly List<Pen> _bodyColors = new List<Pen>
        {
            new Pen(Brushes.Red, 6),
            new Pen(Brushes.Orange, 6),
            new Pen(Brushes.Green, 6),
            new Pen(Brushes.Blue, 6),
            new Pen(Brushes.Indigo, 6),
            new Pen(Brushes.Violet, 6)
        };
        private readonly List<Tuple<JointType, JointType>> _bones = new List<Tuple<JointType, JointType>>
        {
            // Torso
            new Tuple<JointType, JointType>(JointType.Head, JointType.Neck),
            new Tuple<JointType, JointType>(JointType.Neck, JointType.SpineShoulder),
            new Tuple<JointType, JointType>(JointType.SpineShoulder, JointType.SpineMid),
            new Tuple<JointType, JointType>(JointType.SpineMid, JointType.SpineBase),
            new Tuple<JointType, JointType>(JointType.SpineShoulder, JointType.ShoulderRight),
            new Tuple<JointType, JointType>(JointType.SpineShoulder, JointType.ShoulderLeft),
            new Tuple<JointType, JointType>(JointType.SpineBase, JointType.HipRight),
            new Tuple<JointType, JointType>(JointType.SpineBase, JointType.HipLeft),

            // Right Arm
            new Tuple<JointType, JointType>(JointType.ShoulderRight, JointType.ElbowRight),
            new Tuple<JointType, JointType>(JointType.ElbowRight, JointType.WristRight),
            new Tuple<JointType, JointType>(JointType.WristRight, JointType.HandRight),
            new Tuple<JointType, JointType>(JointType.HandRight, JointType.HandTipRight),
            new Tuple<JointType, JointType>(JointType.WristRight, JointType.ThumbRight),

            // Left Arm
            new Tuple<JointType, JointType>(JointType.ShoulderLeft, JointType.ElbowLeft),
            new Tuple<JointType, JointType>(JointType.ElbowLeft, JointType.WristLeft),
            new Tuple<JointType, JointType>(JointType.WristLeft, JointType.HandLeft),
            new Tuple<JointType, JointType>(JointType.HandLeft, JointType.HandTipLeft),
            new Tuple<JointType, JointType>(JointType.WristLeft, JointType.ThumbLeft),

            // Right Leg
            new Tuple<JointType, JointType>(JointType.HipRight, JointType.KneeRight),
            new Tuple<JointType, JointType>(JointType.KneeRight, JointType.AnkleRight),
            new Tuple<JointType, JointType>(JointType.AnkleRight, JointType.FootRight),

            // Left Leg
            new Tuple<JointType, JointType>(JointType.HipLeft, JointType.KneeLeft),
            new Tuple<JointType, JointType>(JointType.KneeLeft, JointType.AnkleLeft),
            new Tuple<JointType, JointType>(JointType.AnkleLeft, JointType.FootLeft)
        };

        private KinectSensor _sensor;
        private CoordinateMapper _coordinateMapper;
        private ColorFrameReader _colorReader;
        private BodyFrameReader _bodyReader;
        private WriteableBitmap _colorBitmap;
        private Body[] _bodies;
        private List<SkeletonFrame> _batch = new List<SkeletonFrame>();
        private DrawingGroup _drawingGroup = new DrawingGroup();

        public event Action<DrawingImage> FrameReady;
        public event Action<List<SkeletonFrame>> BatchReady;
        public event EventHandler<IsAvailableChangedEventArgs> SensorAvailableChanged;

        public void Start()
        {
            _sensor = KinectSensor.GetDefault();
            _coordinateMapper = _sensor.CoordinateMapper;
            _colorReader = _sensor.ColorFrameSource.OpenReader();
            _bodyReader = _sensor.BodyFrameSource.OpenReader();
            FrameDescription desc = _sensor.ColorFrameSource.CreateFrameDescription(ColorImageFormat.Bgra);
            _colorBitmap = new WriteableBitmap(desc.Width, desc.Height, 96.0, 96.0, PixelFormats.Bgra32, null);
            _sensor.IsAvailableChanged += (s, e) => SensorAvailableChanged?.Invoke(s, e);
            _colorReader.FrameArrived += ColorFrameReader_FrameArrived;
            _bodyReader.FrameArrived += BodyFrameReader_FrameArrived;
            _sensor.Open();
        }

        private void BodyFrameReader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            using (var frame = e.FrameReference.AcquireFrame())
            {
                if (frame == null) return;
                if (_bodies == null || _bodies.Length != frame.BodyCount)
                    _bodies = new Body[frame.BodyCount];

                frame.GetAndRefreshBodyData(_bodies);
                ProcessBatch(_bodies, frame.RelativeTime);
                RenderBodyFrame(_bodies);
            }
        }

        private void ProcessBatch(Body[] bodies, TimeSpan timestamp)
        {
            var skeletons = bodies
                .Where(b => b != null && b.IsTracked)
                .Select(b => new Skeleton
                {
                    TrackingId = b.TrackingId,
                    Joints = b.Joints.ToDictionary(j => j.Key, j => new VnuRehab.Models.Joint
                    {
                        X = j.Value.Position.X,
                        Y = j.Value.Position.Y,
                        Z = j.Value.Position.Z,
                        TrackingState = j.Value.TrackingState
                    })
                }).ToList();
            if (!skeletons.Any()) return;
            _batch.Add(new SkeletonFrame
            {
                Timestamp = timestamp,
                Skeletons = skeletons
            });
            if (_batch.Count > FrameThreshold)
            {
                BatchReady?.Invoke(_batch);
                _batch.Clear();
            }
        }

        private void RenderBodyFrame(Body[] bodies)
        {
            using (DrawingContext dc = _drawingGroup.Open())
            {
                dc.DrawImage(_colorBitmap, new Rect(0, 0, _colorBitmap.PixelWidth, _colorBitmap.PixelHeight));
                int penIndex = 0;
                foreach (Body body in bodies)
                {
                    Pen drawPen = _bodyColors[penIndex++];
                    if (body.IsTracked)
                    {
                        IReadOnlyDictionary<JointType, Microsoft.Kinect.Joint> joints = body.Joints;
                        // convert the joint points to depth (display) space
                        Dictionary<JointType, Point> jointPoints = new Dictionary<JointType, Point>();
                        foreach (JointType jointType in joints.Keys)
                        {
                            // sometimes the depth(Z) of an inferred joint may show as negative
                            // clamp down to 0.1f to prevent coordinatemapper from returning (-Infinity, -Infinity)
                            CameraSpacePoint position = joints[jointType].Position;
                            if (position.Z < 0)
                            {
                                position.Z = InferredZPositionClamp;
                            }

                            DepthSpacePoint depthSpacePoint = _coordinateMapper.MapCameraPointToDepthSpace(position);
                            jointPoints[jointType] = new Point(depthSpacePoint.X, depthSpacePoint.Y);
                        }
                        DrawBody(joints, jointPoints, dc, drawPen);
                        DrawHand(body.HandLeftState, jointPoints[JointType.HandLeft], dc);
                        DrawHand(body.HandRightState, jointPoints[JointType.HandRight], dc);
                    }
                }
                // prevent drawing outside of our render area
                FrameDescription desc = _sensor.DepthFrameSource.FrameDescription;
                _drawingGroup.ClipGeometry = new RectangleGeometry(new Rect(0.0, 0.0, desc.Width, desc.Height));
            }
            FrameReady?.Invoke(new DrawingImage(_drawingGroup));
        }

        private void DrawBody(IReadOnlyDictionary<JointType, Microsoft.Kinect.Joint> joints, IDictionary<JointType, Point> jointPoints, DrawingContext drawingContext, Pen drawingPen)
        {
            // Draw the bones
            foreach (var bone in _bones)
            {
                DrawBone(joints, jointPoints, bone.Item1, bone.Item2, drawingContext, drawingPen);
            }

            // Draw the joints
            foreach (JointType jointType in joints.Keys)
            {
                Brush drawBrush = null;
                TrackingState trackingState = joints[jointType].TrackingState;
                if (trackingState == TrackingState.Tracked)
                {
                    drawBrush = _trackedJointBrush;
                }
                else if (trackingState == TrackingState.Inferred)
                {
                    drawBrush = _inferredJointBrush;
                }

                if (drawBrush != null)
                {
                    drawingContext.DrawEllipse(drawBrush, null, jointPoints[jointType], JointThickness, JointThickness);
                }
            }
        }

        private void DrawBone(IReadOnlyDictionary<JointType, Microsoft.Kinect.Joint> joints, IDictionary<JointType, Point> jointPoints, JointType jointType0, JointType jointType1, DrawingContext drawingContext, Pen drawingPen)
        {
            Microsoft.Kinect.Joint joint0 = joints[jointType0];
            Microsoft.Kinect.Joint joint1 = joints[jointType1];

            // If we can't find either of these joints, exit
            if (joint0.TrackingState == TrackingState.NotTracked ||
                joint1.TrackingState == TrackingState.NotTracked)
            {
                return;
            }

            // We assume all drawn bones are inferred unless BOTH joints are tracked
            Pen drawPen = _inferredBonePen;
            if ((joint0.TrackingState == TrackingState.Tracked) && (joint1.TrackingState == TrackingState.Tracked))
            {
                drawPen = drawingPen;
            }

            drawingContext.DrawLine(drawPen, jointPoints[jointType0], jointPoints[jointType1]);
        }

        private void DrawHand(HandState handState, Point handPosition, DrawingContext drawingContext)
        {
            switch (handState)
            {
                case HandState.Closed:
                    drawingContext.DrawEllipse(_handClosedBrush, null, handPosition, HandSize, HandSize);
                    break;

                case HandState.Open:
                    drawingContext.DrawEllipse(_handOpenBrush, null, handPosition, HandSize, HandSize);
                    break;

                case HandState.Lasso:
                    drawingContext.DrawEllipse(_handLassoBrush, null, handPosition, HandSize, HandSize);
                    break;
            }
        }

        private void ColorFrameReader_FrameArrived(object sender, ColorFrameArrivedEventArgs e)
        {
            using (var frame = e.FrameReference.AcquireFrame())
            {
                if (frame == null) return;
                using (var buf = frame.LockRawImageBuffer())
                {
                    _colorBitmap.Lock();
                    frame.CopyConvertedFrameDataToIntPtr(
                        _colorBitmap.BackBuffer,
                        (uint)(_colorBitmap.BackBufferStride * _colorBitmap.PixelHeight),
                        ColorImageFormat.Bgra);
                    _colorBitmap.AddDirtyRect(new Int32Rect(0, 0, _colorBitmap.PixelWidth, _colorBitmap.PixelHeight));
                    _colorBitmap.Unlock();
                }
            }
        }

        public void Stop()
        {
            _colorReader?.Dispose();
            _bodyReader?.Dispose();
            _sensor?.Close();
        }

        public void Dispose()
        {
            Stop();
        }
    }
}