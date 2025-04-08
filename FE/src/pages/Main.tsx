import CamControl from "@/components/CamControl";
import TabsLayout from "@/layouts/TabsLayout";
import { Callout } from "@radix-ui/themes";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [controls, setControls] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [videoSettings, setVideoSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
  });

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      const videoDevices = mediaDevices.filter(
        ({ kind }) => kind === "videoinput"
      );
      console.log("Available video devices:", videoDevices);
      setCameras(videoDevices);

      // If we already have a selected camera and it's still in the list, keep it
      if (
        selectedCamera &&
        videoDevices.some((device) => device.deviceId === selectedCamera)
      ) {
        return;
      }

      // Try to find OBS Virtual Camera first
      const obsCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("obs") ||
          device.label.toLowerCase().includes("virtual")
      );

      if (obsCamera) {
        setSelectedCamera(obsCamera.deviceId);
      } else if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    },
    [selectedCamera]
  );

  // Function to request permissions and enumerate devices
  const initializeDevices = useCallback(async () => {
    try {
      setError("");
      // First try to get any video device without specific constraints
      const initialStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Stop the initial stream immediately
      initialStream.getTracks().forEach((track) => track.stop());

      // Now enumerate all devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      handleDevices(devices);
    } catch (err) {
      console.error("Error initializing devices:", err);
      setError(
        "Please make sure your camera is connected and permissions are granted."
      );
    }
  }, [handleDevices]);

  useEffect(() => {
    initializeDevices();
  }, [initializeDevices]);

  const startStream = async () => {
    try {
      setError("");
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        },
        audio: true,
      };

      console.log("Attempting to start stream with constraints:", constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      console.log("Stream started successfully:", mediaStream.getVideoTracks());

      if (webcamRef.current?.video) {
        webcamRef.current.video.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setError(
        `Failed to access camera: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // If there's an error, try to re-enumerate devices
      initializeDevices();
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped track:", track.label);
      });
      if (webcamRef.current?.video) {
        webcamRef.current.video.srcObject = null;
      }
      setStream(null);
      setControls(false);
      setIsPlaying(false);
    }
  };

  const handleCameraChange = (deviceId: string) => {
    console.log("Changing camera to:", deviceId);
    setSelectedCamera(deviceId);
    if (isPlaying) {
      stopStream();
      startStream();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopStream();
    } else {
      startStream();
    }
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const updateVideoSetting = (
    setting: keyof typeof videoSettings,
    value: number
  ) => {
    setVideoSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const getVideoStyle = () => {
    return {
      filter: `
        brightness(${videoSettings.brightness}%)
        contrast(${videoSettings.contrast}%)
        saturate(${videoSettings.saturation}%)
        blur(${videoSettings.blur}px)
        grayscale(${videoSettings.grayscale}%)
        hue-rotate(${videoSettings.hueRotate}deg)
        invert(${videoSettings.invert}%)
      `,
      opacity: `${videoSettings.opacity}%`,
    };
  };

  return (
    <TabsLayout>
      <div className="items-center grid grid-cols-12 mt-6 gap-2 h-[calc(100vh-8rem)]">
        <div className="col-span-9  overflow-hidden">
          {error && (
            <div className="bg-red-500 rounded-lg text-white p-2 text-center z-10">
              {error}
            </div>
          )}
          <Webcam
            ref={webcamRef}
            controls={controls}
            style={getVideoStyle()}
            className={`rounded-lg ${isVideoEnabled ? "" : "hidden"}`}
            videoConstraints={{
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
            }}
            audio={!isMuted}
            muted={isMuted}
            onUserMediaError={(error) => {
              console.error("Webcam error:", error);
              setError(
                `Webcam error: ${
                  error instanceof Error ? error.message : String(error)
                }`
              );
            }}
          />
        </div>
        <CamControl
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          selectedCamera={selectedCamera}
          handleCameraChange={handleCameraChange}
          cameras={cameras}
          isMuted={isMuted}
          toggleMute={toggleMute}
          isVideoEnabled={isVideoEnabled}
          toggleVideo={toggleVideo}
          videoSettings={videoSettings}
          updateVideoSetting={updateVideoSetting}
          controls={controls}
          setControls={setControls}
        />
      </div>
    </TabsLayout>
  );
};

export default Main;
