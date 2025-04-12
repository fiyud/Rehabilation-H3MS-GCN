// components/FlippableExerciseCard.tsx
import { Spinner, Tooltip } from "@radix-ui/themes";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

interface Exercise {
  id: number;
  name: string;
  instructions: string[];
  tips: string;
  videoUrl: string;
}

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const [flipped, setFlipped] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const videoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (flipped && !iframeLoaded) {
      videoTimeoutRef.current = setTimeout(() => {
        setIframeLoaded(true);
      }, 1000);
    }
    return () => {
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
      }
    };
  }, [flipped, iframeLoaded]);

  useEffect(() => {
    if (!flipped) {
      setIframeLoaded(false);
    }
  }, [flipped]);

  return (
    <Tooltip content="Tap me!">
      <motion.div
        initial={{ height: "320px" }}
        animate={{ height: flipped ? "420px" : "320px" }}
        exit={{ height: "320px" }}
        transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
        className="w-full perspective"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
          style={{
            transformStyle: "preserve-3d",
            cursor: "pointer",
          }}
        >
          {/* Front */}
          <div className="absolute w-full h-full bg-[#242424] rounded-lg p-6 backface-hidden text-white">
            <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-gray-300">
                Instructions:
              </h3>
              <ol className="list-decimal list-inside space-y-1 my-4 text-gray-300 text-sm">
                {exercise?.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
              <p className="my-2 text-sm">*Tips: {exercise?.tips}</p>
            </div>
          </div>

          {/* Back */}
          <div className="w-full h-full bg-[#1e1e1e] rounded-lg p-6 backface-hidden text-white transform rotate-y-180">
            <div className="my-4 w-full">
              {exercise?.videoUrl === "" ? (
                <p>No video available for this exercise.</p>
              ) : flipped && iframeLoaded ? (
                <iframe
                  className="w-full h-auto aspect-video rounded"
                  src={exercise?.videoUrl}
                  title={exercise.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-auto aspect-video rounded flex items-center justify-center">
                  <Spinner size={"3"} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Tooltip>
  );
};

export default ExerciseCard;
