// components/FlippableExerciseCard.tsx
import { Spinner } from "@radix-ui/themes";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface Exercise {
  id: number;
  name: string;
  instructions: string[];
  tips: string;
  icon: React.ReactNode;
  videoUrl: string;
}

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <div
      className="w-full h-[300px] perspective"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          transformStyle: "preserve-3d",
          cursor: "pointer",
        }}
      >
        {/* Front */}
        <div className="absolute w-full h-full bg-[#242424] rounded-lg p-6 backface-hidden text-white">
          <h2 className="text-xl font-semibold mb-4">{exercise.name}</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2 text-gray-300">
              Instructions:
            </h3>
            <div>{exercise?.icon}</div>
            <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
              {exercise?.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Back */}
        <div className="w-full h-full bg-[#1e1e1e] rounded-lg p-6 backface-hidden text-white transform rotate-y-180">
          <h3 className="text-lg font-medium mb-2 text-gray-300">Tips:</h3>
          <p className="text-gray-300 text-sm">{exercise.tips}</p>
          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <Spinner size={"3"} />
            </div>
          ) : (
            <div className="mt-4">
              <iframe
                src={exercise?.videoUrl}
                className="w-full aspect-video rounded"
                onLoad={() => setLoading(false)}
                title={`${exercise.name} video`}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExerciseCard;
