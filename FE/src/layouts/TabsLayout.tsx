import {
  AlertDialog,
  Avatar,
  Blockquote,
  Button,
  Code,
  Flex,
  Select,
  Separator,
  TextField,
} from "@radix-ui/themes";
import { Bell, Cog, HandHelping, Search } from "lucide-react";
import React from "react";
import Sidebar from "../components/Sidebar";
const TabsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-w-screen h-svh">
      <Sidebar />
      <div className="w-full bg-[#161616] grid grid-rows-12 p-6 ">
        <div className="row-span-1 grid grid-cols-12 items-center">
          <div className="col-span-3 flex items-center gap-4 ">
            <Avatar
              src="https://api.dicebear.com/9.x/dylan/svg?seed=Felix"
              fallback="Felix"
            />
            <div className="">
              <h1 className="text-[1.25rem] font-semibold text-[#fafafa]">
                Good Day, Felix
              </h1>
              <span className="text-[0.75rem] text-[#b1b1b1]">
                Customer ID: 123134345
              </span>
            </div>
          </div>
          <div className="col-span-6">
            <TextField.Root
              placeholder="Search the docs…"
              className="dark"
              size={"3"}
            >
              <TextField.Slot side="left">
                <Select.Root defaultValue="apple">
                  <Select.Trigger variant="ghost" className="dark text-white" />
                  <Select.Content className="dark">
                    <Select.Item value="apple">Tabs</Select.Item>
                    <Select.Item value="orange">Marks</Select.Item>
                  </Select.Content>
                </Select.Root>
              </TextField.Slot>
              <TextField.Slot side="left">
                <Separator orientation="vertical" />
              </TextField.Slot>

              <TextField.Slot side="right">
                <Search height="16" width="16" color="#fafafa" />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <ul className="col-span-3 flex items-center justify-center gap-8">
            <li>
              <Button
                variant="ghost"
                className="text-[#ccc] py-2 cursor-pointer"
              >
                <Bell />
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="text-[#ccc] py-2 cursor-pointer "
              >
                <Cog />
              </Button>
            </li>
            <li>
              <AlertDialog.Root>
                <AlertDialog.Trigger className="dark">
                  <Button
                    variant="ghost"
                    className="text-[#ccc] py-2 cursor-pointer "
                  >
                    <HandHelping />
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content className="dark" maxWidth="600px">
                  <AlertDialog.Title className="text-white">
                    OBS Virtual Camera Guide
                  </AlertDialog.Title>
                  <AlertDialog.Description className="text-white" size="2">
                    <Blockquote className="mt-4">
                      <h3 className="text-lg font-medium mb-2 text-gray-300">
                        Instructions:
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>
                          Make sure you have{" "}
                          <a href="https://obsproject.com/" target="_blank">
                            OBS Studio
                          </a>{" "}
                          installed
                        </li>
                        <li>
                          Use the{" "}
                          <a
                            href="https://obsproject.com/forum/resources/obs-kinect-with-faux-green-screen.897/"
                            target="_blank"
                          >
                            Kinectv2 for OBS
                          </a>{" "}
                          plugin <span>or</span> follow this{" "}
                          <a
                            href="https://www.youtube.com/watch?v=iEtKBZ2crUE"
                            target="_blank"
                          >
                            instruction
                          </a>
                          .
                        </li>
                        <li>
                          Start the Virtual Camera in OBS (
                          <Code className="text-[#ccc]">Tools</Code> &gt;{" "}
                          <Code className="text-[#ccc]">
                            StartVirtual Camera
                          </Code>
                          )
                        </li>
                        <li>Click the "Connect to OBS" button above</li>
                        <li>
                          If you see any errors, check the console (F12) for
                          more details
                        </li>
                      </ol>
                    </Blockquote>
                  </AlertDialog.Description>

                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Action>
                      <Button variant="solid" color="blue">
                        Understood !
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </li>
          </ul>
        </div>
        <div className="row-span-11 max-h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default TabsLayout;
