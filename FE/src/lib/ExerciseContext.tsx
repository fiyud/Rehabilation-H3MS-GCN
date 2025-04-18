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
  selectedExerciseType: string;
  setSelectedExerciseType: React.Dispatch<React.SetStateAction<string>>;
  finishExercise: boolean;
  setFinishExercise: React.Dispatch<React.SetStateAction<boolean>>;
  setExerciseError: React.Dispatch<React.SetStateAction<string>>;
  exerciseError: string;
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
  const [selectedExerciseType, setSelectedExerciseType] = useState<string>("");
  const [startExercise, setStartExercise] = useState(false);
  const [finishExercise, setFinishExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState("");
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(180);
  const triggerTimer = () => {
    setTimer((prev) => prev - 1);
    if (timer <= 0) {
      setFinishExercise(true);
      setStartExercise(false);
      setTimer(180);
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
