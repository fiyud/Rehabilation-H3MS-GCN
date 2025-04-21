import { ExerciseDialog } from "@/components";
import OBSStream from "@/components/OBSStream";
import TabsLayout from "@/layouts/TabsLayout";
import { useDevice, useExercise, useAuth ,useStream} from "@/lib";
import {
  Dialog,
  Flex,
  IconButton,
  Link,
  ScrollArea,
  Button,
  Tooltip,
} from "@radix-ui/themes";
import { HandHelping } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
const OBSViewer: React.FC = () => {
  const { openedConsole, setOpenedConsole } = useDevice();
  const { stream } = useStream();
  const { user } = useAuth();
  const { startExercise, stopExercise } = useExercise();

  const openConsole = () => {
    // Open Kinect application with smaller window size
    const childWindow = window.open(
      `kinectapp://start?userId=${user?.id}`,
      "targetWindow",
      `toolbar=no,
       location=no,
       status=no,
       menubar=no,
       scrollbars=yes,
       resizable=yes,
       width=400,height=300`
    );

    if (childWindow && childWindow.document && !openedConsole) {
      setOpenedConsole(true);
      childWindow.document.writeln(`
        <html>
          <body>
            <script>
              window.userId = "${user?.id}";
              document.write("<h1>Connecting to Kinect console app...</h1>");
            <\/script>
          </body>
        </html>
      `);
      setTimeout(() => {
        childWindow.close();
      }, 3000);
    }
  };
  return (
    <TabsLayout>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="h-[calc(100vh-8rem)] "
        >
          {/* {deviceError && (
            <Callout.Root color="red" className="mb-4">
              <Callout.Icon>
                <Info />
              </Callout.Icon>
              <Callout.Text>{deviceError}</Callout.Text>
            </Callout.Root>
          )} */}

          <div className="flex flex-col justify-center h-full">
            <div className="grid grid-cols-12 gap-6 my-6 ">
              <div className="bg-[#242424] col-span-9 rounded-lg p-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center">
                  <OBSStream />
                </div>
              </div>
              <ScrollArea
                className="col-span-3 bg-[#242424] rounded-lg p-4 text-white"
                type="auto"
                scrollbars="vertical"
              >
                <div className="flex items-center justify-between ">
                  <h2 className="text-xl font-bold mb-4">OBS Virtual Camera</h2>
                  <Tooltip content="Open the console app">
                    <Button
                      variant="classic"
                      className="cursor-pointer"
                      color="amber"
                      onClick={openConsole}
                    >
                      Start Console
                    </Button>
                  </Tooltip>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-1">
                      What is OBS Virtual Camera?
                    </h3>

                    <p className="text-sm text-gray-300">
                      A feature that allows OBS Studio to act as a webcam for
                      other applications.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-1">
                      How to Use
                    </h3>
                    <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                      <li>Start OBS Studio</li>
                      <li>Click "Start Virtual Camera" in OBS</li>
                      <li>Select OBS Camera in your application</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-1">
                      General instructions
                    </h3>
                    <Flex align="center" gap="2" wrap={"wrap"}>
                      <span className="text-sm text-gray-300">
                        Please revise by clicking
                      </span>
                      <IconButton variant="soft">
                        <HandHelping />
                      </IconButton>
                      <span className="text-sm text-gray-300">
                        on the navigation bar.
                      </span>
                    </Flex>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-1">
                      Status
                    </h3>
                    <Flex align="center" gap="2">
                      <div
                        className={`w-3 h-3 rounded-full animate-pulse ${
                          stream ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span>{stream ? "Connected" : "Not Connected"}</span>
                    </Flex>
                  </div>

                  {stream && (
                    <p className="text-sm text-gray-300 p-0">
                      Ready? Let's{" "}
                      <Dialog.Root>
                        <Dialog.Trigger>
                          <Link className="cursor-pointer hover:underline">
                            start your session!
                          </Link>
                        </Dialog.Trigger>
                        <ExerciseDialog />
                      </Dialog.Root>
                    </p>
                  )}
                  {startExercise && (
                    <p className="text-sm text-gray-300 p-0">
                      Tired? You can just{" "}
                      <Link
                        onClick={stopExercise}
                        color="red"
                        className="text-red-500 hover:text-red-700 hover:underline"
                      >
                        Stop !
                      </Link>
                    </p>
                  )}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400">
                      For more information, visit the{" "}
                      <a
                        href="https://obsproject.com/kb/virtual-camera-guide"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        OBS Virtual Camera Guide
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </TabsLayout>
  );
};

export default OBSViewer;
