import { ExerciseVideos } from "@/assets/CustomAssets";
import { ExerciseCard } from "@/components";
import TabsLayout from "@/layouts/TabsLayout";
import { SegmentedControl } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
const Exercises: React.FC = () => {
  const prmd = [
    {
      id: 1,
      name: "Deep Squat",
      videoUrl: ExerciseVideos.DeepSquat,
      instructions: [
        "Stand with feet shoulder-width apart",
        "Toes pointing slightly outward",
        "Lower your body by bending your knees and hips",
        "Keep your chest up and back straight",
        "Go as low as you can while maintaining proper form",
        "Return to starting position by pushing through your heels",
      ],
      tips: "Keep your knees aligned with your toes and maintain a neutral spine throughout the movement.",
    },
    {
      id: 2,
      name: "Hurdle Step",

      videoUrl: ExerciseVideos.HurdleStep,
      instructions: [
        "Stand with feet hip-width apart",
        "Place a hurdle or object at knee height",
        "Lift one leg and step over the hurdle",
        "Keep your standing leg stable",
        "Step down with control on the other side",
        "Return to starting position and repeat with other leg",
      ],
      tips: "Maintain balance and control throughout the movement. Keep your core engaged.",
    },
    {
      id: 3,
      name: "Inline Lunge",

      videoUrl: ExerciseVideos.InlineLunge,
      instructions: [
        "Stand with feet together",
        "Step one foot backward in a straight line",
        "Lower your back knee toward the ground",
        "Keep your front knee aligned with your ankle",
        "Push through your front foot to return to start",
        "Repeat with other leg",
      ],
      tips: "Keep your torso upright and maintain balance throughout the movement.",
    },
    {
      id: 4,
      name: "Side Lunge",

      videoUrl: ExerciseVideos.SideLunge,
      instructions: [
        "Stand with feet together",
        "Step one foot to the side",
        "Bend the stepping leg's knee",
        "Keep the other leg straight",
        "Push back to starting position",
        "Repeat on other side",
      ],
      tips: "Keep your chest up and maintain proper knee alignment over your toes.",
    },
    {
      id: 5,
      name: "Sit to Stand",

      videoUrl: ExerciseVideos.SitToStand,
      instructions: [
        "Start seated in a chair",
        "Place feet shoulder-width apart",
        "Lean slightly forward",
        "Push through your heels to stand",
        "Keep your back straight",
        "Lower back down with control",
      ],
      tips: "Use your leg muscles to power the movement, not momentum.",
    },
    {
      id: 6,
      name: "Standing Active Straight Leg Raise",

      videoUrl: ExerciseVideos.StandingActiveStraightLegRaise,
      instructions: [
        "Stand on one leg",
        "Keep standing leg slightly bent",
        "Lift other leg straight in front",
        "Keep your back straight",
        "Hold briefly at the top",
        "Lower with control",
      ],
      tips: "Maintain balance and keep your core engaged throughout.",
    },
    {
      id: 7,
      name: "Standing Shoulder Abduction",

      videoUrl: ExerciseVideos.StandingShoulderAbduction,
      instructions: [
        "Stand with arms at sides",
        "Raise arms out to the sides",
        "Keep elbows straight",
        "Raise to shoulder height",
        "Hold briefly",
        "Lower with control",
      ],
      tips: "Keep your shoulders down and away from your ears.",
    },
    {
      id: 8,
      name: "Standing Shoulder Extension",

      videoUrl: ExerciseVideos.StandingShoulderExtension,
      instructions: [
        "Stand with arms raised forward",
        "Keep elbows straight",
        "Move arms backward",
        "Keep your chest up",
        "Hold briefly",
        "Return to start",
      ],
      tips: "Maintain proper posture and control throughout the movement.",
    },
    {
      id: 9,
      name: "Standing Shoulder Internal-External Rotation",
      videoUrl: ExerciseVideos.StandingShoulderInternalExternalRotation,
      instructions: [
        "Stand with elbow bent at 90 degrees",
        "Keep elbow at your side",
        "Rotate arm inward",
        "Then rotate outward",
        "Keep your wrist straight",
        "Repeat for desired reps",
      ],
      tips: "Keep your elbow stable at your side throughout the rotation.",
    },
    {
      id: 10,
      name: "Standing Shoulder Scaption",

      videoUrl: ExerciseVideos.StandingShoulderScaption,
      instructions: [
        "Stand with arms at sides",
        "Raise arms at 45-degree angle",
        "Keep thumbs pointing up",
        "Raise to shoulder height",
        "Hold briefly",
        "Lower with control",
      ],
      tips: "Keep your shoulders down and maintain proper form throughout.",
    },
  ];
  const kimore = [
    {
      id: 11,
      name: "Jumping Jacks",
      videoUrl: ExerciseVideos.JumpingJacks, // <- make sure this exists in your ExerciseVideos object
      instructions: [
        "Stand upright with feet together and arms at your sides",
        "Jump while spreading your legs shoulder-width apart",
        "Simultaneously raise your arms overhead",
        "Jump again to return to the starting position",
        "Repeat at a steady pace",
      ],
      tips: "Maintain a consistent rhythm and land softly on your feet to avoid joint strain.",
    },
    {
      id: 12,
      name: "Arm Circles",
      videoUrl: ExerciseVideos.ArmCircles,
      instructions: [
        "Stand with feet shoulder-width apart",
        "Extend both arms out to the sides at shoulder height",
        "Start making small forward circles with your arms",
        "Gradually increase the size of the circles",
        "Reverse the direction after a set time",
      ],
      tips: "Keep your arms straight and engage your shoulders for maximum benefit.",
    },
    {
      id: 13,
      name: "Torso Twists",
      videoUrl: ExerciseVideos.TorsoTwists,
      instructions: [
        "Stand with feet hip-width apart",
        "Bend your elbows and place hands in front of you",
        "Twist your upper body to the left while keeping hips stable",
        "Return to center and twist to the right",
        "Continue alternating sides",
      ],
      tips: "Engage your core and avoid moving your hips for an effective twist.",
    },
    {
      id: 14,
      name: "Squats",
      videoUrl: ExerciseVideos.Squats,
      instructions: [
        "Stand with feet shoulder-width apart",
        "Keep your chest up and back straight",
        "Bend your knees and hips to lower down",
        "Lower as if sitting into a chair",
        "Push through your heels to return to standing",
      ],
      tips: "Keep your knees aligned with your toes and avoid leaning too far forward.",
    },
    {
      id: 15,
      name: "Lateral Arm Raises",
      videoUrl: ExerciseVideos.LateralArmRaises,
      instructions: [
        "Stand with arms at your sides",
        "Raise both arms out to the sides until shoulder height",
        "Pause briefly at the top",
        "Lower arms back down with control",
        "Repeat for desired repetitions",
      ],
      tips: "Avoid shrugging your shoulders and use light weights if needed for better form.",
    },
  ];
  const [selectedSet, setSelectedSet] = React.useState("prmd");
  return (
    <TabsLayout>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center  bg-[#161616] min-h-screen"
        >
          <h1 className="text-[2.5rem] font-bold py-4 text-white">
            Exercise Instructions
          </h1>
          <SegmentedControl.Root
            defaultValue="prmd"
            onValueChange={(value) => {
              setSelectedSet(value);
            }}
            size={"3"}
            className="w-full mb-6 *:cursor-pointer"
          >
            <SegmentedControl.Item value="prmd">UI-PRMD</SegmentedControl.Item>
            <SegmentedControl.Item value="kimore">KIMORE</SegmentedControl.Item>
          </SegmentedControl.Root>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {selectedSet == "prmd"
              ? prmd.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))
              : kimore.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </TabsLayout>
  );
};

export default Exercises;
