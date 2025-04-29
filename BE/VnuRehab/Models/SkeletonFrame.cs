using System;
using System.Collections.Generic;
using Microsoft.Kinect;

namespace VnuRehab.Models
{
    public class Joint
    {
        public float X { get; set; }
        public float Y { get; set; }
        public float Z { get; set; }
        public TrackingState TrackingState { get; set; }
    }

    public class Skeleton
    {
        public ulong TrackingId { get; set; }
        public Dictionary<JointType, Joint> Joints { get; set; } = new Dictionary<JointType, Joint>();
    }

    public class SkeletonFrame
    {
        public TimeSpan Timestamp { get; set; } = TimeSpan.Zero;
        public List<Skeleton> Skeletons { get; set; } = new List<Skeleton>();
    }
}