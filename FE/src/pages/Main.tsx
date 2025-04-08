import CamControl from "@/components/CamControl";
import TabsLayout from "@/layouts/TabsLayout";
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

  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoDevices = mediaDevices.filter(
      ({ kind }) => kind === "videoinput"
    );
    setCameras(videoDevices);
    if (videoDevices.length > 0) {
      setSelectedCamera(videoDevices[0].deviceId);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1400,
          facingMode: "user",
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        },
        audio: true,
      });

      if (webcamRef.current?.video) {
        webcamRef.current.video.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (webcamRef.current?.video) {
        webcamRef.current.video.srcObject = null;
      }
      setStream(null);
      setControls(false);
      setIsPlaying(false);
    }
  };

  const handleCameraChange = (deviceId: string) => {
    console.log(deviceId);
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
        <div className="col-span-9 relative rounded-lg overflow-hidden">
          <Webcam
            ref={webcamRef}
            controls={controls}
            style={getVideoStyle()}
            className={` rounded-lg ${isVideoEnabled ? "" : "hidden"}`}
            videoConstraints={{
              facingMode: "user",
              width: 2000,
              deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
            }}
            audio={!isMuted}
            muted={isMuted}
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
