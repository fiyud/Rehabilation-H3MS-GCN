import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ExerciseContextType {
  setStartExercise: React.Dispatch<React.SetStateAction<boolean>>;
  startExercise: boolean;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  timer: number;
  selectedExerciseType: Exercises | undefined;
  setSelectedExerciseType: React.Dispatch<
    React.SetStateAction<Exercises | undefined>
  >;
  finishExercise: boolean;
  setFinishExercise: React.Dispatch<React.SetStateAction<boolean>>;
  setExerciseError: React.Dispatch<React.SetStateAction<string>>;
  exerciseError: string;
  stopExercise: () => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}
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
const ExerciseContext = createContext<ExerciseContextType | undefined>(
  undefined
);

interface ExerciseProviderProps {
  children: ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({
  children,
}) => {
  const [selectedExerciseType, setSelectedExerciseType] = useState<
    Exercises | undefined
  >(undefined);
  const [startExercise, setStartExercise] = useState(false);
  const [finishExercise, setFinishExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState("");
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(180);
  const [search, setSearch] = useState<string>("");
  const triggerTimer = () => {
    if (startExercise && !finishExercise) {
      setTimer((prev) => prev - 1);
      if (timer <= 0) {
        setFinishExercise(true);
        setStartExercise(false);
        setTimer(180);
      }
    }
  };
  useEffect(() => {
    if (startExercise) {
      const interval = setInterval(() => {
        triggerTimer();
      }, 1000);
      return () => clearInterval(interval);
    }
  });
  const stopExercise = () => {
    setStartExercise(false);
    setFinishExercise(true);
  };
  const value = {
    startExercise,
    setStartExercise,
    points,
    setPoints,
    timer,
    selectedExerciseType,
    setSelectedExerciseType,
    finishExercise,
    setFinishExercise,
    setExerciseError,
    exerciseError,
    stopExercise,
    search,
    setSearch,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error("useExercise must be used within an ExerciseProvider");
  }
  return context;
};
