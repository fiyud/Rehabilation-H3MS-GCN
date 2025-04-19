import { Badge, Button, Spinner } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useExercise, useDevice, useAuth } from "@/lib";
import { SkeletonCanvas, Frame } from "@/components";
import * as signalR from "@microsoft/signalr";
interface OBSStreamProps {
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
}

const OBSStream: React.FC<OBSStreamProps> = ({ onStreamReady, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [conn, setConn] = useState<signalR.HubConnection | undefined>();
  const { setPoints, points, startExercise, timer, finishExercise } =
    useExercise();
  const [frame, setFrame] = useState<Frame | undefined>();
  const { devices, reserveDevice, releaseDevice } = useDevice();
  const { isAuthenticated, user } = useAuth();
  const { selectedExerciseType } = useExercise();
  useEffect(() => {
    if (!isAuthenticated) return;

    if (connectionStatus == "connected") {
      const newConn = new signalR.HubConnectionBuilder()
        .withUrl(
          `${import.meta.env.VITE_SERVER_URL}/kinecthub?type=ui&userId=${
            user?.id
          }`
        )
        .withAutomaticReconnect()
        .build();
      setConn(newConn);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (conn) {
      conn
        .start()
        .then(() => {
          console.log("Connected!");
          conn.on("ReceiveScore", (data: number) => {
            console.log(data);
            setPoints(data);
          });
          conn.on("ReceiveFrame", (data: string) => {
            setFrame(JSON.parse(data));
          });
        })
        .catch((err) => console.error("Connection failed: ", err));
    }
  }, [conn]);

  useEffect(() => {
    const handleExercise = async () => {
      if (selectedExerciseType) {
        console.log(selectedExerciseType);
        await conn?.invoke("SetExerciseType", user?.id, selectedExerciseType);
      }
    };

    handleExercise();
  }, [selectedExerciseType]);

  const connectToOBS = async () => {
    try {
      setLoading(true);
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

      console.log("OBS Device:", obsDevice);
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
        if (onStreamReady) {
          onStreamReady(stream);
        }
      }
      window.open(`kinect://start?userId=${user?.id}`);
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
      releaseDevice();
      setConnectionStatus("disconnected");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      disconnectFromOBS();
    };
  }, []);

  return (
    <>
      <a href={`kinectapp://start?userId=${user?.id}`} target="_blank" className="z-100 text-white">dat sieu nhan</a>

      <div className="relative h-full">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <SkeletonCanvas data={frame} />
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full rounded-lg"
          />
        </div>
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
        {startExercise && (
          <Badge
            color="amber"
            size={"3"}
            className="absolute bottom-2 left-2 text-[22px] p-2"
          >
            Points: {points.toFixed(2)}
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
    </>
  );
};

export default OBSStream;
