import { CamControl } from "@/components";
import { TabsLayout } from "@/layouts";
import { Info } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { AnimatePresence, motion } from "motion/react";
import { Flex, Spinner, Callout } from "@radix-ui/themes";
import { useDevice } from "@/lib";
const Main: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [controls, setControls] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const {
    isPlaying,
    setIsPlaying,
    isMuted,
    isVideoEnabled,
    setIsMuted,
    setIsVideoEnabled,
  } = useDevice();
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
  const {
    setDeviceError,
    selectedCamera,
    initializeDevices,
    setSelectedCamera,
    deviceError,
    devices,
    releaseDevice,
    reserveDevice,
  } = useDevice();

  const startStream = async () => {
    try {
      setLoading(true);
      setDeviceError("");
      reserveDevice(selectedCamera);
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
      setDeviceError(
        `Failed to access camera: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      initializeDevices();

      // If there's an error, try to re-enumerate devices
    } finally {
      setLoading(false);
    }
  };

  const stopStream = () => {
    try {
      setLoading(true);
      if (webcamRef?.current && webcamRef?.current?.video?.srcObject) {
        const localStream = webcamRef.current.video.srcObject as MediaStream;
        localStream.getTracks().forEach((track) => track.stop());
        webcamRef.current.video.srcObject = null;
        setStream(null);
        setControls(false);
        setIsPlaying(false);
      }
      // Release the device
      releaseDevice();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraChange = (deviceId: string) => {
    try {
      setLoading(true);
      setSelectedCamera(deviceId);
      if (isPlaying) {
        stopStream();
        startStream();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);
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
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="items-center grid grid-cols-12 mt-6 gap-2 h-[calc(100vh-8rem)]"
        >
          <div className="col-span-9 h-full overflow-hidden">
            {deviceError && (
              <Callout.Root color="red" className="mb-4">
                <Callout.Icon>
                  <Info />
                </Callout.Icon>
                <Callout.Text>{deviceError}</Callout.Text>
              </Callout.Root>
            )}
            {loading ? (
              <Flex justify="center" align="center" className="h-full">
                <Spinner size={"3"} />
              </Flex>
            ) : (
              <Webcam
                ref={webcamRef}
                controls={controls}
                style={getVideoStyle()}
                className={`rounded-lg ${isVideoEnabled ? "" : "hidden"}`}
                videoConstraints={{
                  width: { ideal: 1920, min: 640 },
                  height: { ideal: 1080, min: 480 },
                  deviceId: selectedCamera
                    ? { exact: selectedCamera }
                    : undefined,
                  facingMode: "user",
                }}
                audio={!isMuted}
                muted={isMuted}
                onUserMediaError={(error) => {
                  console.error("Webcam error:", error);
                  setDeviceError(
                    `Webcam error: ${
                      error instanceof Error ? error.message : String(error)
                    }`
                  );
                }}
              />
            )}
          </div>
          <CamControl
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            selectedCamera={selectedCamera}
            handleCameraChange={handleCameraChange}
            cameras={devices}
            isMuted={isMuted}
            toggleMute={toggleMute}
            isVideoEnabled={isVideoEnabled}
            toggleVideo={toggleVideo}
            videoSettings={videoSettings}
            updateVideoSetting={updateVideoSetting}
            controls={controls}
            setControls={setControls}
          />
        </motion.div>
      </AnimatePresence>
    </TabsLayout>
  );
};

export default Main;
