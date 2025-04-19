import kimore from "@/assets/exercise-svgrepo-com (1).svg";
import prmd from "@/assets/exercise-svgrepo-com (2).svg";
import { useExercise } from "@/lib";
import { Button, Dialog, Flex, RadioCards, Tooltip } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

const ExerciseDialog: React.FC = () => {
  const { setStartExercise, setSelectedExerciseType, selectedExerciseType } =
    useExercise();
  function handleChooseExercise(formData: FormData) {
    const query = formData.get("exercise");
    if (query) {
      setSelectedExerciseType(query as string);
    }
    setStartExercise(true);
  }
  return (
    <Dialog.Content>
      <form action={handleChooseExercise} method="post">
        <Dialog.Title>Choose your exercise type</Dialog.Title>
        <Dialog.Description size="2" my={"6"}>
          {selectedExerciseType == "" ? (
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
                    onClick={(e) =>
                      setSelectedExerciseType(e.currentTarget.value)
                    }
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
                    onClick={(e) =>
                      setSelectedExerciseType(e.currentTarget.value)
                    }
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
                {ExtractSelectedExercise(selectedExerciseType)}
              </motion.div>
            </AnimatePresence>
          )}
        </Dialog.Description>
        <Flex gap={"2"} justify="end">
          {selectedExerciseType == "" ? (
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
                  setSelectedExerciseType("");
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
const ExtractSelectedExercise = (exercise: string) => {
  enum KimoreExercises {
    JumpingJacks = "Kimore_JumpingJacks",
    ArmCircles = "Kimore_ArmCircles",
    TorsoTwists = "Kimore_TorsoTwists",
    Squats = "Kimore_Squats",
    LateralArmRaises = "Kimore_LateralArmRaises",
  }

  enum PRMDExercises {
    DeepSquat = "UIPRMD_DeepSquat",
    HurdleStep = "UIPRMD_HurdleStep",
    InlineLunge = "UIPRMD_InlineLunge",
    SideLunge = "UIPRMD_SideLunge",
    SitToStand = "UIPRMD_SitToStand",
    StandingActiveStraightLegRaise = "UIPRMD_StandingActiveStraightLegRaise",
    StandingShoulderAbduction = "UIPRMD_StandingShoulderAbduction",
    StandingShoulderExtension = "UIPRMD_StandingShoulderExtension",
    StandingShoulderInternalExternalRotation = "UIPRMD_StandingShoulderInternalExternalRotation",
    StandingShoulderScaption = "UIPRMD_StandingShoulderScaption",
  }

  const kimoreExercises = [
    { name: "Jumping jacks", value: KimoreExercises.JumpingJacks },
    { name: "Arm circles", value: KimoreExercises.ArmCircles },
    { name: "Torso twists", value: KimoreExercises.TorsoTwists },
    { name: "Squats", value: KimoreExercises.Squats },
    { name: "Lateral arm raises", value: KimoreExercises.LateralArmRaises },
  ];

  const prmdExercises = [
    { name: "Deep Squat", value: PRMDExercises.DeepSquat },
    { name: "Hurdle Step", value: PRMDExercises.HurdleStep },
    { name: "Inline Lunge", value: PRMDExercises.InlineLunge },
    { name: "Side Lunge", value: PRMDExercises.SideLunge },
    { name: "Sit to Stand", value: PRMDExercises.SitToStand },
    {
      name: "Standing Active Straight Leg Raise",
      value: PRMDExercises.StandingActiveStraightLegRaise,
    },
    {
      name: "Standing Shoulder Abduction",
      value: PRMDExercises.StandingShoulderAbduction,
    },
    {
      name: "Standing Shoulder Extension",
      value: PRMDExercises.StandingShoulderExtension,
    },
    {
      name: "Standing Shoulder Internal-External Rotation",
      value: PRMDExercises.StandingShoulderInternalExternalRotation,
    },
    {
      name: "Standing Shoulder Scaption",
      value: PRMDExercises.StandingShoulderScaption,
    },
  ];

  switch (exercise) {
    case "Kimore":
      return (
        <RadioCards.Root
          className="w-full"
          defaultValue="kimore-1"
          name="exercise"
          columns={{ initial: "1", sm: "3" }}
        >
          {kimoreExercises.map((ex, index) => (
            <RadioCards.Item key={`kimore-${index + 1}`} value={ex?.value}>
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
            <RadioCards.Item key={`prmd-${index + 1}`} value={ex?.value}>
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
