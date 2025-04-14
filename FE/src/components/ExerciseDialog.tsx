import kimore from "@/assets/exercise-svgrepo-com (1).svg";
import prmd from "@/assets/exercise-svgrepo-com (2).svg";
import { useExercise } from "@/lib";
import { Button, Dialog, Flex, RadioCards, Tooltip } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

const ExerciseDialog: React.FC = () => {
  const [exercise, setExercise] = React.useState<string>("");
  const { setStartExercise } = useExercise();
  function search(formData: FormData) {
    const query = formData.get("exercise");
    if (query) {
      console.log("Selected exercise:", query);
      setExercise(query as string);
    }
    setStartExercise(true);
  }
  return (
    <Dialog.Content>
      <form action={search} method="post">
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
                    onClick={(e) => setExercise(e.currentTarget.value)}
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
                    onClick={(e) => setExercise(e.currentTarget.value)}
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
                key={exercise}
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
const ExtractSelectedExercise = (exercise: string) => {
  const kimoreExercises = [
    "Jumping jacks",
    "Arm circles",
    "Hip twists",
    "Lateral arm raises",
    "Torso twists",
  ];

  const prmdExercises = [
    "Deep Squat",
    "Hurdle Step",
    "Inline Lunge",
    "Side Lunge",
    "Sit to Stand",
    "Standing Active Straight Leg Raise",
    "Standing Shoulder Abduction",
    "Standing Shoulder Extension",
    "Standing Shoulder Internal-External Rotation",
    "Standing Shoulder Scaption",
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
            <RadioCards.Item
              key={`kimore-${index + 1}`}
              value={`kimore-${index + 1}`}
            >
              <Flex direction="column" width="100%">
                <p>{ex}</p>
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
            <RadioCards.Item
              key={`prmd-${index + 1}`}
              value={`prmd-${index + 1}`}
            >
              <Flex direction="column" width="100%">
                <p>{ex}</p>
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
