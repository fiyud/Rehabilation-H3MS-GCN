import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useDevice } from "@/lib";
interface StreamContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamLoading: boolean;
  streamError: string | null;
  isConnecting: boolean;
  connectionStatus: string;
  connectToOBS: () => Promise<void>;
  disconnectFromOBS: () => void;
  stream: MediaStream | null;
  setConnectionStatus: React.Dispatch<React.SetStateAction<string>>;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
}

export const StreamProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { devices, reserveDevice, releaseDevice } = useDevice();
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const connectToOBS = async () => {
    try {
      setStreamLoading(true);
      setIsConnecting(true);
      setConnectionStatus("connecting");

      // Find OBS Virtual Camera
      const obsDevice = devices?.find(
        (device) =>
          device.label.toLowerCase().includes("obs") ||
          device.label.toLowerCase().includes("virtual")
      );
      if (!obsDevice) {
        throw new Error(
          "OBS Virtual Camera not found. Please make sure OBS is running and Virtual Camera is started."
        );
      }
      // Reserve the device
      reserveDevice(obsDevice.deviceId);

      if (!obsDevice) {
        throw new Error(
          "OBS Virtual Camera not found. Please make sure OBS is running and Virtual Camera is started."
        );
      }

      // Get stream from OBS Virtual Camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: obsDevice.deviceId ? obsDevice.deviceId : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStream(stream);
      }

      setIsConnecting(false);
      setConnectionStatus("connected");
    } catch (error) {
      console.error("Error connecting to OBS:", error);
      setIsConnecting(false);
      setConnectionStatus("failed");
      setStreamError(
        `Failed to connect to OBS: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setStreamLoading(false);
    }
  };

  const disconnectFromOBS = () => {
    try {
      setStreamLoading(true);
      if (videoRef?.current && videoRef?.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      releaseDevice();
      setConnectionStatus("disconnected");
    } catch (error) {
      console.error(error);
    } finally {
      setStreamLoading(false);
    }
  };

  const value = {
    videoRef,
    streamLoading,
    streamError,
    isConnecting,
    connectionStatus,
    connectToOBS,
    disconnectFromOBS,
    stream,
    setConnectionStatus
  };
  return (
    <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within an DeviceProvider");
  }
  return context;
};
