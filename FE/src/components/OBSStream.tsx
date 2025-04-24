import { Badge, Button, Spinner } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useExercise, useDevice, useAuth, http, useStream } from "@/lib";
import { SkeletonCanvas, Frame } from "@/components";
import * as signalR from "@microsoft/signalr";
enum Exercises {
  Kimore_JumpingJacks,
  Kimore_ArmCircles,
  Kimore_TorsoTwists,
  Kimore_Squats,
  Kimore_LateralArmRaises,
  UIPRMD_DeepSquat,
  UIPRMD_HurdleStep,
  UIPRMD_InlineLunge,
  UIPRMD_SideLunge,
  UIPRMD_SitToStand,
  UIPRMD_StandingActiveStraightLegRaise,
  UIPRMD_StandingShoulderAbduction,
  UIPRMD_StandingShoulderExtension,
  UIPRMD_StandingShoulderInternalExternalRotation,
  UIPRMD_StandingShoulderScaption,
}

const OBSStream: React.FC = () => {
  const [frame, setFrame] = useState<Frame | undefined>();
  const { conn, setConn, setLoading, loading } = useDevice();
  const { setPoints, points, startExercise, timer, finishExercise } =
    useExercise();
  const {
    videoRef,
    connectionStatus,
    connectToOBS,
    disconnectFromOBS,
    isConnecting,
    setConnectionStatus,
  } = useStream();
  const { isAuthenticated, user } = useAuth();
  const { selectedExerciseType, setStartExercise, setFinishExercise } =
    useExercise();
  const [limit, setLimit] = useState<number>();

  console.log(
    selectedExerciseType && Exercises[selectedExerciseType].split("_")[0]
  );
  console.log(
    selectedExerciseType &&
      Exercises[selectedExerciseType].split("_")[0] == "Kimore"
  );
  console.log(limit);
  // mark checks
  const [totalMark, setTotalMark] = useState<number>(0);
  const [resetView, setResetView] = useState(false);
  const [count, setCount] = useState<number>(0);

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
            setPoints(data);
            setTotalMark((prev) => prev + data);
            setCount((prev) => prev + 1);
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
        await conn?.invoke(
          "SetExerciseType",
          user?.id,
          Number(selectedExerciseType)
        );
      }
    };
    selectedExerciseType &&
    Exercises[selectedExerciseType].split("_")[0] == "Kimore"
      ? setLimit(50)
      : setLimit(1);
    handleExercise();
  }, [selectedExerciseType]);

  useEffect(() => {
    if (finishExercise) {
      conn?.stop().then(async () => {
        try {
          setLoading(true);
          const resp = await http.post("/exercises", {
            type: selectedExerciseType
              ? Exercises[selectedExerciseType]
              : undefined,
            score: totalMark / count,
            duration: 180 - timer,
          });

          if (resp.status === 200) {
            console.log("Exercise finished successfully");
            setTimeout(() => {
              setResetView(true);
            }, 5000);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      });
    }
  }, [finishExercise]);

  useEffect(() => {
    return () => {
      disconnectFromOBS();
      setConnectionStatus("disconnected");
      setStartExercise(false);
      setFinishExercise(false);
    };
  }, []);

  return (
    <>
      <div className="relative h-full">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <SkeletonCanvas
            data={frame}
            width={videoRef.current?.width || 1280}
            height={videoRef.current?.height || 720}
            sizingFactor={0.9}
          />
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full rounded-lg "
          />
        </div>
        {finishExercise && resetView == false && (
          <motion.div
            key="finish"
            exit={{ opacity: 0 }}
            className="absolute w-full h-full z-30 top-0 left-0 bg-gray-600/30 backdrop-blur-md flex flex-col items-center justify-center text-white text-2xl font-bold "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1>Exercise Finished !</h1>
            <dl className="flex item-center justify-between w-full max-w-[50rem] p-4 bg-white/10 rounded-lg text-white">
              <dt className="text-lg font-bold underline">Score:</dt>
              <dd className="text-lg">{points.toFixed(2)}</dd>
              <dt className="text-lg font-bold underline">Duration:</dt>
              <dd className="text-lg ">
                {Math.floor((180 - timer) / 60)}:
                {(180 - timer) % 60 < 10
                  ? `0${(180 - timer) % 60}`
                  : `${(180 - timer) % 60}`}{" "}
                seconds
              </dd>
              <dt className="text-lg font-bold underline">Average:</dt>
              <dd className="text-lg">{(totalMark / count).toFixed(2)}</dd>
            </dl>
          </motion.div>
        )}
        {startExercise && (
          <Badge
            color="grass"
            className="absolute top-2 left-2 text-[0.875rem] p-2  "
          >
            {timer && timer > 0
              ? `Time left: ${Math.floor(timer / 60)}:${
                  timer % 60 < 10 ? `0${timer % 60}` : `${timer % 60}`
                } seconds`
              : "Done !"}
          </Badge>
        )}
        {startExercise && (
          <Badge
            color="yellow"
            size={"3"}
            className="absolute bottom-2 left-2 text-[22px] p-2"
          >
            Points: {points.toFixed(2)} / {limit}
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
          className="cursor-pointer absolute top-2 right-2 text-white px-3 py-1 rounded z-30"
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
