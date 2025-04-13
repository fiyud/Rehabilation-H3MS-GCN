import { useExercise } from "@/lib/ExerciseContext";
import { Badge, Button, Spinner } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface OBSStreamProps {
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
}

const OBSStream: React.FC<OBSStreamProps> = ({ onStreamReady, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { timer, startExercise, finishExercise } = useExercise();

  const connectToOBS = async () => {
    try {
      setLoading(true);
      setIsConnecting(true);
      setConnectionStatus("connecting");

      // Get available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Available video devices:", videoDevices);

      // Find OBS Virtual Camera
      const obsDevice = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("obs") ||
          device.label.toLowerCase().includes("virtual")
      );

      if (!obsDevice) {
        throw new Error(
          "OBS Virtual Camera not found. Please make sure OBS is running and Virtual Camera is started."
        );
      }

      // Get stream from OBS Virtual Camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: obsDevice.deviceId },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        if (onStreamReady) {
          onStreamReady(stream);
        }
      }

      setIsConnecting(false);
      setConnectionStatus("connected");
    } catch (error) {
      console.error("Error connecting to OBS:", error);
      setIsConnecting(false);
      setConnectionStatus("failed");
      if (onError) {
        onError(
          `Failed to connect to OBS: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectFromOBS = () => {
    try {
      setLoading(true);
      if (videoRef?.current && videoRef?.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setConnectionStatus("disconnected");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnectFromOBS();
    };
  }, []);

  return (
    <div className="relative h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-auto rounded-lg"
      />
      {finishExercise && (
        <motion.div
          key="finish"
          exit={{ opacity: 0 }}
          className="absolute w-full h-full z-30 top-0 left-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Exercise Finished !
        </motion.div>
      )}
      {startExercise && (
        <Badge
          color="gray"
          className="absolute top-2 left-2 text-[0.875rem] p-2  "
        >
          {timer && timer > 0
            ? `Time left: ${Math.floor(timer / 60)}:${
                timer % 60 < 10 ? `0${timer % 60}` : `${timer % 60}`
              } minutes`
            : "Done !"}
        </Badge>
      )}
      <Badge
        className="absolute bottom-2 right-2 text-[0.875rem] p-2  "
        color={connectionStatus ? "green" : "red"}
      >
        {connectionStatus || "Not connected"}
      </Badge>
      <Button
        loading={loading}
        onClick={
          connectionStatus !== "connected" ? connectToOBS : disconnectFromOBS
        }
        color={connectionStatus !== "connected" ? "blue" : "red"}
        variant="classic"
        className="cursor-pointer absolute top-2 right-2 text-white px-3 py-1 rounded"
      >
        {isConnecting ? (
          <Spinner size={"2"} />
        ) : connectionStatus == "connected" ? (
          "Disconnect from OBS"
        ) : (
          "Connect to OBS"
        )}
      </Button>
    </div>
  );
};

export default OBSStream;
