import { Badge, Button, Flex } from "@radix-ui/themes";
import { Disc } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface OBSStreamProps {
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
}

const OBSStream: React.FC<OBSStreamProps> = ({ onStreamReady, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  // Function to connect to OBS Virtual Camera
  const connectToOBS = async () => {
    try {
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
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoRef?.current && videoRef?.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
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
      <Badge
        className="absolute bottom-2 right-2  px-2 py-1 "
        color={connectionStatus ? "green" : "red"}
      >
        {connectionStatus || "Not connected"}
      </Badge>
      <Button
        onClick={connectToOBS}
        color={connectionStatus !== "connected" ? "blue" : "red"}
        variant="solid"
        
        className={`${
          connectionStatus !== "connected"
            ? "cursor-pointer"
            : "cursor-not-allowed"
        } absolute top-2 right-2 text-white px-3 py-1 rounded `}
      >
        {isConnecting ? (
          "Connecting..."
        ) : connectionStatus == "connected" ? (
          <Flex align={"center"} gap="1">
            <Disc size={16} className="animate-pulse" />
            <span>Connected</span>
          </Flex>
        ) : (
          "Connect to OBS"
        )}
      </Button>
    </div>
  );
};

export default OBSStream;
