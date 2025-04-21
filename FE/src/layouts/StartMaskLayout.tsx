import { useExercise } from "@/lib";
import React, { useEffect, useState } from "react";
const StartMaskLayout = ({ children }: { children: React.ReactNode }) => {
  const [count, setCount] = useState(3);
  const { startExercise } = useExercise();
  useEffect(() => {
    if (startExercise && count > 0) {
      const timer = setTimeout(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, startExercise]);
  return (
    <>
      {count > 0 && startExercise && (
        <div className="fixed inset-0 z-100 h-full w-full bg-gray-600/30 backdrop-blur-md flex items-center justify-center text-white text-5xl font-bold">
          Starting in {count}...
        </div>
      )}

      <>{children}</>
    </>
  );
};

export default StartMaskLayout;
