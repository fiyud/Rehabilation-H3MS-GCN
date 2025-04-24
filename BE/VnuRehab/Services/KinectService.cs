using System.Collections.Generic;
using System.Windows.Media;
using System;
using Microsoft.Kinect;

namespace VnuRehab.Services
{
    public class KinectService : IDisposable
    {
        private KinectSensor _kinectSensor = null;
        private CoordinateMapper _coordinateMapper = null;
        private BodyFrameReader _bodyFrameReader = null;
        private Body[] _bodies = null;
        private List<Tuple<JointType, JointType>> _bones;
        private int _displayWidth;
        private int _displayHeight;

        public KinectSensor KinectSensor { get => _kinectSensor; }
        public CoordinateMapper CoordinateMapper { get => _coordinateMapper; }
        public BodyFrameReader BodyFrameReader { get => _bodyFrameReader; }
        public Body[] Bodies { get => _bodies; }
        public List<Tuple<JointType, JointType>> Bones { get => _bones; }
        public int DisplayWidth { get => _displayWidth; }
        public int DisplayHeight { get => _displayHeight; }

        public void Start()
        {
            if (_kinectSensor != null)
            {
                _kinectSensor.Close();
                _kinectSensor = null;
            }
            _kinectSensor = KinectSensor.GetDefault();
            if (_kinectSensor != null)
            {
                _coordinateMapper = _kinectSensor.CoordinateMapper;
                FrameDescription frameDescription = _kinectSensor.DepthFrameSource.FrameDescription;
                _displayWidth = frameDescription.Width;
                _displayHeight = frameDescription.Height;
                _bodyFrameReader = _kinectSensor.BodyFrameSource.OpenReader();

                _bones = new List<Tuple<JointType, JointType>>
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

                _kinectSensor.Open();
            }
        }

        public void Stop()
        {
            if (_bodyFrameReader != null)
            {
                _bodyFrameReader.Dispose();
                _bodyFrameReader = null;
            }

            if (_kinectSensor != null)
            {
                _kinectSensor.Close();
                _kinectSensor = null;
            }
        }

        public void Dispose()
        {
            Stop();
        }
    }
}
