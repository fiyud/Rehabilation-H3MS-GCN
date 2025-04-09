using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Kinect;
using Newtonsoft.Json;

namespace BE
{
    class Program
    {
        static KinectSensor sensor;
        static BodyFrameReader bodyReader;
        static Body[] bodies;
        static int frameCounter = 0;

        static void Main(string[] args)
        {
            Console.WriteLine("📡 Logging Kinect Skeleton Data to Console...");

            sensor = KinectSensor.GetDefault();
            if (sensor == null)
            {
                Console.WriteLine("❌ Kinect not detected.");
                return;
            }

            sensor.Open();
            bodyReader = sensor.BodyFrameSource.OpenReader();
            bodies = new Body[sensor.BodyFrameSource.BodyCount];
            bodyReader.FrameArrived += BodyFrameArrived;

            Console.WriteLine("⏹ Press ENTER to stop...");
            Console.ReadLine();

            bodyReader?.Dispose();
            sensor?.Close();
        }

        private static void BodyFrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            using (var frame = e.FrameReference.AcquireFrame())
            {
                if (frame == null) return;

                frame.GetAndRefreshBodyData(bodies);
                frameCounter++;

                string timestamp = DateTime.Now.ToString("HH:mm:ss.fff", CultureInfo.InvariantCulture);

                for (int i = 0; i < bodies.Length; i++)
                {
                    var body = bodies[i];
                    if (!body.IsTracked) continue;

                    foreach (var joint in body.Joints)
                    {
                        var jointType = joint.Key;
                        var jointData = joint.Value;

                        string log = string.Format(CultureInfo.InvariantCulture,
                            "[Frame {0}] Time: {1} | Body: {2} | Joint: {3} | X: {4:F6} Y: {5:F6} Z: {6:F6} | State: {7}",
                            frameCounter,
                            timestamp,
                            i,
                            jointType,
                            jointData.Position.X,
                            jointData.Position.Y,
                            jointData.Position.Z,
                            jointData.TrackingState
                        );

                        Console.WriteLine(log);
                    }
                }
            }
        }
    }
}
