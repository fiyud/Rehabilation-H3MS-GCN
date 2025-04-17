import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

interface DeviceContextType {
  devices?: MediaDeviceInfo[];
  selectedCamera: string;
  setSelectedCamera: React.Dispatch<React.SetStateAction<string>>;
  startExercise: boolean;
  setStartExercise: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  loading: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  initializeDevices: () => Promise<void>;
  reserveDevice: (deviceId: string) => void;
  releaseDevice: () => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>();
  const [startExercise, setStartExercise] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);

  // Function to reserve a device
  const reserveDevice = (deviceId: string) => {
    if (activeDevice && activeDevice !== deviceId) {
      throw new Error("Device is already in use by another component.");
    }
    setActiveDevice(deviceId);
  };

  // Function to release a device
  const releaseDevice = () => {
    setActiveDevice(null);
  };

  // Provide these functions in the context

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      try {
        setLoading(true);
        const videoDevices = mediaDevices.filter(
          ({ kind }) => kind === "videoinput"
        );
        console.log("Available video devices:", videoDevices);
        setDevices(videoDevices);
        if (
          selectedCamera &&
          videoDevices.some((device) => device.deviceId === selectedCamera)
        ) {
          return;
        }
      } catch (err) {
        console.error("Error handling devices:", err);
        setError("Failed to enumerate devices. Please check your camera.");
      } finally {
        setLoading(false);
      }
    },
    [selectedCamera]
  );
  // Function to request permissions and enumerate devices
  const initializeDevices = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [handleDevices]);

  useEffect(() => {
    initializeDevices();
  }, [initializeDevices]);
  const value = {
    devices,
    selectedCamera,
    setSelectedCamera,
    startExercise,
    setStartExercise,
    error,
    loading,
    setError,
    setLoading,
    initializeDevices,
    releaseDevice,
    reserveDevice,
  };
  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within an DeviceProvider");
  }
  return context;
};
