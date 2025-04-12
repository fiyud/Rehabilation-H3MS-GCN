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

      <Flex gap="3" mt="4" justify="end">
        {exercise == "" ? (
          <Dialog.Close>
            <Button variant="soft" className="cursor-pointer" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
        ) : (
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
            <Flex direction="row" width="100%">
              <p>8-core CPU</p>
              <p>32GB RAM</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="2">
            <Flex direction="column" width="100%">
              <p>6-core CPU</p>
              <p>24GB RAM</p>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item value="3">
            <Flex direction="column" width="100%">
              <p>4-core CPU</p>
              <p>16GB RAM</p>
            </Flex>
          </RadioCards.Item>
        </RadioCards.Root>
      );
    case "PRMD":
      return "PRMD";
    default:
      return null;
  }
};
export default ExerciseDialog;
