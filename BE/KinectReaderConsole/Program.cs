using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Kinect;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace KinectReaderConsole
{
    internal class Program
    {
        static KinectSensor sensor;
        static BodyFrameReader bodyFrameReader;
        static Body[] bodies;
        static HubConnection connection;
        static List<object> batch = new List<object>();

        static void Main(string[] args)
        {
            connection = new HubConnectionBuilder()
                .WithUrl("http://localhost:5160/kinectHub")
                .WithAutomaticReconnect()
                .Build();
            connection.StartAsync().Wait();
            Console.WriteLine("Connected to SignalR hub.");

            sensor = KinectSensor.GetDefault();
            if (sensor == null)
            {
                Console.WriteLine("Kinect not detected.");
                return;
            }
            sensor.Open();
            bodyFrameReader = sensor.BodyFrameSource.OpenReader();
            bodies = new Body[sensor.BodyFrameSource.BodyCount];
            bodyFrameReader.FrameArrived += BodyFrameReader_FrameArrived;

            Console.WriteLine("Press ENTER to stop...");
            Console.ReadLine();

            bodyFrameReader?.Dispose();
            if (sensor != null && sensor.IsOpen)
            {
                sensor.Close();
                Console.WriteLine("Kinect sensor closed.");
            }
        }

        private static void BodyFrameReader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            using (var frame = e.FrameReference.AcquireFrame())
            {
                if (frame != null)
                {
                    frame.GetAndRefreshBodyData(bodies);
                    var skeletons = bodies
                        .Where(b => b != null && b.IsTracked)
                        .Select(b => new
                        {
                            b.TrackingId,
                            Joints = b.Joints.ToDictionary(
                                j => j.Key.ToString(),
                                j => new
                                {
                                    j.Value.Position.X,
                                    j.Value.Position.Y,
                                    j.Value.Position.Z,
                                    TrackingState = j.Value.TrackingState.ToString()
                                }
                            ),
                        })
                        .ToList();

                    if (skeletons.Any())
                    {
                        var data = new
                        {
                            Timestamp = frame.RelativeTime.ToString(),
                            Skeletons = skeletons
                        };

                        batch.Add(data);
                        if (batch.Count >= 50)
                        {
                            try
                            {
                                connection.InvokeAsync("SendBatchToAI", JsonConvert.SerializeObject(batch)).Wait();
                                batch.Clear();
                            } catch (Exception ex)
                            {
                                Console.WriteLine($"Error sending batch: {ex.Message}");
                            }
                        }
                    }
                }
            }
        }
    }
}