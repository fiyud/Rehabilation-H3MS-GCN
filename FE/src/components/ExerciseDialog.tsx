import kimore from "@/assets/exercise-svgrepo-com (1).svg";
import prmd from "@/assets/exercise-svgrepo-com (2).svg";
import { Button, Dialog, Flex, RadioCards, Tooltip } from "@radix-ui/themes";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

const ExerciseDialog: React.FC = () => {
  const [exercise, setExercise] = React.useState<string>("");
  return (
    <Dialog.Content>
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
            <Button variant="classic" className="cursor-pointer" color="blue">
              Confirm
            </Button>
          </Flex>
        )}
      </Flex>
    </Dialog.Content>
  );
};
const ExtractSelectedExercise = (exercise: string) => {
  switch (exercise) {
    case "Kimore":
      return (
        <RadioCards.Root
          className="w-full"
          defaultValue="1"
          columns={{ initial: "1", sm: "3" }}
        >
          <RadioCards.Item value="1">
            <Flex direction="column" width="100%">
              <p>Jumping jacks</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <Flex direction="column" width="100%">
              <p>Arm circles</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <Flex direction="column" width="100%">
              <p>Hip twists</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="4">
            <Flex direction="column" width="100%">
              <p>Lateral arm raises</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="5">
            <Flex direction="column" width="100%">
              <p>Torso twists</p>
            </Flex>
          </RadioCards.Item>
        </RadioCards.Root>
      );
    case "PRMD":
      return (
        <RadioCards.Root
          className="w-full"
          defaultValue="1"
          columns={{ initial: "1", sm: "3" }}
        >
          <RadioCards.Item value="1">
            <Flex direction="column" width="100%">
              <p>Deep Squat</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <Flex direction="column" width="100%">
              <p>Hurdle Step</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <Flex direction="column" width="100%">
              <p>Inline Lunge</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="4">
            <Flex direction="column" width="100%">
              <p>Side Lunge</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="5">
            <Flex direction="column" width="100%">
              <p>Sit to Stand</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="6">
            <Flex direction="column" width="100%">
              <p>Standing Active Straight Leg Raise</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="7">
            <Flex direction="column" width="100%">
              <p>Standing Shoulder Abduction</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="8">
            <Flex direction="column" width="100%">
              <p>Standing Shoulder Extension</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="9">
            <Flex direction="column" width="100%">
              <p>Standing Shoulder Internal-External Rotation</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="10">
            <Flex direction="column" width="100%">
              <p>Standing Shoulder Scaption</p>
            </Flex>
          </RadioCards.Item>
        </RadioCards.Root>
      );
    default:
      return null;
  }
};
export default ExerciseDialog;
