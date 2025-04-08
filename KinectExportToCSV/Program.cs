using System;
using System.IO;
using System.Collections.Generic;
using Microsoft.Kinect;
using CsvHelper;
using System.Globalization;
using System.Threading;

namespace KinectStudioCapture
{
    public class SkeletonData
    {
        public long FrameNumber { get; set; }
        public string Timestamp { get; set; }
        public int BodyIndex { get; set; }
        public string JointName { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
        public float Z { get; set; }
        public string TrackingState { get; set; }
    }

    class Program
    {
        // Define the fixed output directory - you can change this path
        private static readonly string OutputDirectory = @"C:\Users\Unknown\Documents\Kinect Studio\Repository\converted";

        static List<SkeletonData> allData = new List<SkeletonData>();
        static long frameCount = 0;
        static bool isCapturing = false;

        static void Main(string[] args)
        {
            Console.WriteLine("Kinect Studio Capture to CSV");
            Console.WriteLine("============================");
            Console.WriteLine("\nFollow these steps:");
            Console.WriteLine("1. Open Kinect Studio");
            Console.WriteLine("2. Load your .xef file");
            Console.WriteLine("3. Press Enter in this window to start capturing");
            Console.WriteLine("4. Start playback in Kinect Studio");
            Console.WriteLine("5. Press 'Q' when the recording is finished playing");

            // Ensure output directory exists
            EnsureOutputDirectoryExists();

            // Get output filename only
            Console.Write("\nEnter filename for output CSV (without path): ");
            string fileName = Console.ReadLine().Trim();

            // Add .csv extension if not provided
            if (!fileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            {
                fileName += ".csv";
            }

            // Combine with output directory
            string csvFilePath = Path.Combine(OutputDirectory, fileName);

            Console.WriteLine($"\nOutput will be saved to: {csvFilePath}");

            // Wait for user to be ready
            Console.WriteLine("\nPress Enter when ready to start capturing...");
            Console.ReadLine();

            try
            {
              KinectSensor sensor = KinectSensor.GetDefault();
                {
                    if (sensor != null)
                    {
                        Console.WriteLine("Kinect sensor found, starting capture...");

                        // Open the sensor
                        sensor.Open();

                        // Create a body frame reader
                        BodyFrameReader bodyReader = sensor.BodyFrameSource.OpenReader();

                        // Register for new frames
                        bodyReader.FrameArrived += BodyReader_FrameArrived;

                        isCapturing = true;
                        Console.WriteLine("Capturing data... Press 'Q' to stop");

                        // Wait for key press to stop
                        while (isCapturing)
                        {
                            if (Console.KeyAvailable)
                            {
                                var key = Console.ReadKey(true).Key;
                                if (key == ConsoleKey.Q)
                                {
                                    isCapturing = false;
                                }
                            }

                            Thread.Sleep(10);
                        }

                        // Clean up
                        bodyReader.FrameArrived -= BodyReader_FrameArrived;
                        bodyReader.Dispose();
                        sensor.Close();
                    }
                    else
                    {
                        Console.WriteLine("Error: No Kinect sensor found. Make sure your Kinect is connected.");
                        return;
                    }
                }

                // Write data to CSV
                Console.WriteLine($"\nCapture complete. Writing {allData.Count} records to CSV...");

                using (var writer = new StreamWriter(csvFilePath))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    csv.WriteRecords(allData);
                }

                Console.WriteLine($"\nExport complete! Data saved to: {csvFilePath}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\nError: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }

        private static void EnsureOutputDirectoryExists()
        {
            if (!Directory.Exists(OutputDirectory))
            {
                try
                {
                    Directory.CreateDirectory(OutputDirectory);
                    Console.WriteLine($"Created output directory: {OutputDirectory}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error creating output directory: {ex.Message}");
                    Console.WriteLine("Please modify the OutputDirectory path in the code.");
                    Console.WriteLine("\nPress any key to exit...");
                    Console.ReadKey();
                    Environment.Exit(1);
                }
            }
        }

        private static void BodyReader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            using (BodyFrame frame = e.FrameReference.AcquireFrame())
            {
                if (frame != null)
                {
                    // Get timestamp
                    string timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff");

                    // Get body data
                    Body[] bodies = new Body[frame.BodyFrameSource.BodyCount];
                    frame.GetAndRefreshBodyData(bodies);

                    // Process each body
                    for (int i = 0; i < bodies.Length; i++)
                    {
                        Body body = bodies[i];

                        if (body.IsTracked)
                        {
                            // Process each joint
                            foreach (JointType jointType in Enum.GetValues(typeof(JointType)))
                            {
                                Joint joint = body.Joints[jointType];

                                allData.Add(new SkeletonData
                                {
                                    FrameNumber = frameCount,
                                    Timestamp = timestamp,
                                    BodyIndex = i,
                                    JointName = jointType.ToString(),
                                    X = joint.Position.X,
                                    Y = joint.Position.Y,
                                    Z = joint.Position.Z,
                                    TrackingState = joint.TrackingState.ToString()
                                });
                            }
                        }
                    }

                    frameCount++;

                    // Show progress every 30 frames
                    if (frameCount % 30 == 0)
                    {
                        Console.WriteLine($"Captured {frameCount} frames...");
                    }
                }
            }
        }
    }
}