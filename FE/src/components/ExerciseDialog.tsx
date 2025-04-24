import kimore from "@/assets/exercise-svgrepo-com (1).svg";
import prmd from "@/assets/exercise-svgrepo-com (2).svg";
import { useExercise } from "@/lib";
import { Button, Dialog, Flex, RadioCards, Tooltip } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

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

const ExerciseDialog: React.FC = () => {
  const { setStartExercise, setSelectedExerciseType, selectedExerciseType } =
    useExercise();
  const [exercise, setExercise] = useState<string>("");
  function handleChooseExercise(formData: FormData) {
    const query = formData.get("exercise");
    if (query) {
      setSelectedExerciseType(query as unknown as Exercises);
    }
    setStartExercise(true);
  }
  return (
    <Dialog.Content>
      <form action={handleChooseExercise} method="post">
        <Dialog.Title>Choose your exercise type</Dialog.Title>
        <Dialog.Description size="2" my={"6"}>
          {exercise == "" ? (
            <AnimatePresence mode="wait">
              <motion.div
                className="flex items-center gap-2 justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <Tooltip content="Kimore">
                  <motion.button
                    value={"Kimore"}
                    onClick={(e) => {
                      setExercise(e.currentTarget.value);
                    }}
                    type="button"
                    whileHover={{
                      rotateX: 20,
                      rotateY: 20,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                    }}
                    className="border border-gray-300 rounded-lg cursor-pointer p-4 bg-[#1e1f21]"
                  >
                    <img className="object-contain w-60 h-auto" src={kimore} />
                  </motion.button>
                </Tooltip>
                <Tooltip content="PRMD">
                  <motion.button
                    type="button"
                    value={"PRMD"}
                    onClick={(e) => {
                      setExercise(e.currentTarget.value);
                    }}
                    className="border border-gray-300 rounded-lg cursor-pointer p-4 bg-[#1e1f21]"
                    whileHover={{
                      rotateX: 20,
                      rotateY: 20,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                    }}
                  >
                    <img className="object-contain w-60 h-auto" src={prmd} />
                  </motion.button>
                </Tooltip>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedExerciseType}
                className="flex items-center gap-2 justify-center"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {ExtractSelectedExercise(exercise)}
              </motion.div>
            </AnimatePresence>
          )}
        </Dialog.Description>
        <Flex gap={"2"} justify="end">
          {exercise == "" ? (
            <Dialog.Close>
              <Button variant="soft" className="cursor-pointer" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
          ) : (
            <Flex gap={"2"} justify="end">
              <Button
                variant="soft"
                onClick={() => {
                  setExercise("");
                }}
                className="cursor-pointer"
                color="gray"
              >
                Cancel
              </Button>
              <Dialog.Close>
                <Button
                  variant="classic"
                  type="submit"
                  className="cursor-pointer"
                  color="blue"
                >
                  Confirm
                </Button>
              </Dialog.Close>
            </Flex>
          )}
        </Flex>
      </form>
    </Dialog.Content>
  );
};
const ExtractSelectedExercise = (chosenExercise: string) => {
  const kimoreExercises = [
    { name: "Jumping jacks", value: Exercises.Kimore_JumpingJacks },
    { name: "Arm circles", value: Exercises.Kimore_ArmCircles },
    { name: "Torso twists", value: Exercises.Kimore_TorsoTwists },
    { name: "Squats", value: Exercises.Kimore_Squats },
    { name: "Lateral arm raises", value: Exercises.Kimore_LateralArmRaises },
  ];

  const prmdExercises = [
    { name: "Deep Squat", value: Exercises.UIPRMD_DeepSquat },
    { name: "Hurdle Step", value: Exercises.UIPRMD_HurdleStep },
    { name: "Inline Lunge", value: Exercises.UIPRMD_InlineLunge },
    { name: "Side Lunge", value: Exercises.UIPRMD_SideLunge },
    { name: "Sit to Stand", value: Exercises.UIPRMD_SitToStand },
    {
      name: "Standing Active Straight Leg Raise",
      value: Exercises.UIPRMD_StandingActiveStraightLegRaise,
    },
    {
      name: "Standing Shoulder Abduction",
      value: Exercises.UIPRMD_StandingShoulderAbduction,
    },
    {
      name: "Standing Shoulder Extension",
      value: Exercises.UIPRMD_StandingShoulderExtension,
    },
    {
      name: "Standing Shoulder Internal-External Rotation",
      value: Exercises.UIPRMD_StandingShoulderInternalExternalRotation,
    },
    {
      name: "Standing Shoulder Scaption",
      value: Exercises.UIPRMD_StandingShoulderScaption,
    },
  ];

  switch (chosenExercise) {
    case "Kimore":
      return (
        <RadioCards.Root
          className="w-full"
          defaultValue="kimore-1"
          name="exercise"
          columns={{ initial: "1", sm: "3" }}
        >
          {kimoreExercises.map((ex, index) => (
            <RadioCards.Item
              key={`kimore-${index + 1}`}
              value={ex?.value.toString()}
            >
              <Flex direction="column" width="100%">
                <p>{ex?.name}</p>
              </Flex>
            </RadioCards.Item>
          ))}
        </RadioCards.Root>
      );
    case "PRMD":
      return (
        <RadioCards.Root
          className="w-full"
          defaultValue="prmd-1"
          name="exercise"
          columns={{ initial: "1", sm: "3" }}
        >
          {prmdExercises.map((ex, index) => (
            <RadioCards.Item key={`prmd-${index + 1}`} value={ex?.value.toString()}>
              <Flex direction="column" width="100%">
                <p>{ex?.name}</p>
              </Flex>
            </RadioCards.Item>
          ))}
        </RadioCards.Root>
      );
    default:
      return null;
  }
};
export default ExerciseDialog;
