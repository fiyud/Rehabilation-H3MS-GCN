// components/FlippableExerciseCard.tsx
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Loader2 } from "lucide-react";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
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
              <div className="absolute w-full h-full text-left bg-main-1 rounded-lg p-6 backface-hidden text-main-3">
                <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2 text-main-3">
                    Instructions:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 my-4 text-gray-700 text-sm">
                    {exercise?.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                  <p className="my-2 text-sm">*Tips: {exercise?.tips}</p>
                </div>
              </div>

              {/* Back */}
              <div className="w-full h-full bg-main-1 rounded-lg p-6 backface-hidden text-white transform rotate-y-180">
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
                      <Loader2 size={"3"} className="animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tap me!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExerciseCard;
