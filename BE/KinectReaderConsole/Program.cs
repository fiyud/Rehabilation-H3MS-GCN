using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Configuration;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Kinect;
using Newtonsoft.Json;

namespace KinectReaderConsole
{
    internal class Program
    {
        static string userId;
        static KinectSensor sensor;
        static BodyFrameReader bodyFrameReader;
        static Body[] bodies;
        static HubConnection connection;
        static readonly List<object> batch = new List<object>();

        static void Main(string[] args)
        {
            if (args.Length > 0)
            {
                string url = args[0];
                Uri uri = new Uri(url);
                string query = uri.Query;
                var queryParams = HttpUtility.ParseQueryString(query);
                userId = queryParams["userId"];
                Console.WriteLine($"User ID: {userId}");
            }
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("User ID not passed as parameter.");
                return;
            }
            Console.WriteLine("Please don't close this window.");
            Console.WriteLine("Initializing Kinect and SignalR...");
            InitializeKinect();
            InitializeSignalR();
            Console.WriteLine("Press ENTER to stop...");
            Console.ReadLine();

            bodyFrameReader?.Dispose();
            if (sensor != null && sensor.IsOpen)
            {
                sensor.Close();
                Console.WriteLine("Kinect sensor closed.");
            }
        }

        private static void InitializeKinect()
        {
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
            sensor.IsAvailableChanged += Sensor_IsAvailableChanged;
        }

        private static async void InitializeSignalR()
        {
            string url = ConfigurationManager.AppSettings["SignalRHubUrl"] ?? "http://localhost:8080/kinecthub";
            Console.WriteLine($"Connecting to SignalR hub at {url}...");
            connection = new HubConnectionBuilder()
                .WithUrl(url)
                .WithAutomaticReconnect()
                .Build();
            connection.Reconnected += (error) =>
            {
                Console.WriteLine("Reconnected to SignalR hub.");
                return Task.CompletedTask;
            };
            connection.Closed += async (error) =>
            {
                Console.WriteLine("Connection closed. Attempting to reconnect in 5s...");
                await Task.Delay(5000);
            };
            try
            {
                await connection.StartAsync();
                Console.WriteLine("Connected to SignalR hub.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error connecting to SignalR hub: {ex.Message}");
                return;
            }
        }

        private static void Sensor_IsAvailableChanged(object sender, IsAvailableChangedEventArgs e)
        {
            Console.WriteLine($"Kinect is {(e.IsAvailable ? "available" : "not available")}");
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
                                    TrackingState = j.Value.TrackingState.ToString(),
                                }
                            ),
                        })
                        .ToList();

                    if (skeletons.Any())
                    {
                        var data = new
                        {
                            Timestamp = frame.RelativeTime.ToString(),
                            Skeletons = skeletons,
                        };
                        connection.InvokeAsync("SendFrameToUser", userId, JsonConvert.SerializeObject(data));

                        batch.Add(data);
                        if (batch.Count >= 50)
                        {
                            try
                            {
                                connection.InvokeAsync("SendBatchToAI", userId, JsonConvert.SerializeObject(batch)).Wait();
                                batch.Clear();
                            }
                            catch (Exception ex)
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