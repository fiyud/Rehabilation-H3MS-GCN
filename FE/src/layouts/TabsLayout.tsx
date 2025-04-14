import { Sidebar } from "@/components";
import { useAuth } from "@/lib";
import {
  AlertDialog,
  Avatar,
  Badge,
  Blockquote,
  Box,
  Button,
  Card,
  Code,
  DataList,
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  Link,
  Select,
  Separator,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  Bell,
  Cog,
  ContactRound,
  CopyIcon,
  HandHelping,
  Search,
  UserPen,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
const TabsLayout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex min-w-screen h-svh">
      <Sidebar />
      <div className="w-full bg-[#161616] grid grid-rows-12 p-6 gap-2">
        <div className="row-span-1 grid grid-cols-12 items-center">
          <div className="col-span-3 flex items-center gap-4">
            {isAuthenticated ? (
              <Card asChild>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Link className="bg-transparent cursor-pointer flex items-center gap-3">
                      <Avatar
                        size="3"
                        src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                        fallback="T"
                      />
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          Teodros Girmay
                        </Text>
                        <Text as="div" size="2" color="gray">
                          Engineering
                        </Text>
                      </Box>
                    </Link>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      shortcut="⌘ E"
                      onClick={() => setDrawerOpen(true)}
                    >
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item shortcut="⌘ D">
                      Settings
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator />
                    <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Card>
            ) : (
              <Dialog.Root>
                <Dialog.Trigger>
                  <Link
                    className="hover:underline cursor-pointer"
                    onClick={() => console.log("cc")}
                  >
                    Login
                  </Link>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                  <Dialog.Title>Login</Dialog.Title>

                  <Flex direction="column" gap="3">
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Name
                      </Text>
                      <TextField.Root
                        defaultValue="Freja Johnsen"
                        placeholder="Enter your full name"
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        UID
                      </Text>
                      <TextField.Root
                        defaultValue="freja@example.com"
                        placeholder="Enter your UID"
                      />
                    </label>
                  </Flex>

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button>Login</Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            )}
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
        {drawerOpen && (
          <motion.div
            key={"overlay"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <motion.div
          key={"drawer"}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: drawerOpen ? 0 : 300 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-80 bg-[#161616]  shadow-lg z-50 p-6"
        >
          <Flex pb={"4"} justify={"end"}>
            <Button
              onClick={() => setDrawerOpen(false)}
              variant="classic"
              color="gray"
            >
              <X size={16} />
            </Button>
          </Flex>
          <Box>
            <Badge mb="4" color="blue" className="border" variant="soft">
              <UserPen size={20} />
              <h1 className="text-[1rem] font-medium">Basic Identification</h1>
            </Badge>
            <DataList.Root>
              <DataList.Item align="center">
                <DataList.Label minWidth="88px">Status</DataList.Label>
                <DataList.Value>
                  <Badge color="jade" variant="soft" radius="full">
                    Authorized
                  </Badge>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">ID</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Code variant="soft">u_2J89JSA4GJ</Code>
                    <IconButton
                      size="1"
                      aria-label="Copy value"
                      color="gray"
                      variant="ghost"
                      onClick={() =>
                        window.navigator.clipboard.writeText("u_2J89JSA4GJ")
                      }
                    >
                      <CopyIcon size={"16"} />
                    </IconButton>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Name</DataList.Label>
                <DataList.Value>Vlad Moroz</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Gender</DataList.Label>
                <DataList.Value>Male</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Date of Birth</DataList.Label>
                <DataList.Value>Vlad Moroz</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Box>
          <Separator my="6" size="4" />
          <Box>
            <Badge mb="4" color="red" className="border" variant="soft">
              <ContactRound size={20} />
              <h1 className="text-[1rem] font-medium">Contact Information</h1>
            </Badge>
            <DataList.Root>
              <DataList.Item>
                <DataList.Label minWidth="88px">Phone number</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Code variant="soft">u_2J89JSA4GJ</Code>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Email address</DataList.Label>{" "}
                <DataList.Value>
                  <Link href="mailto:vlad@workos.com">vlad@workos.com</Link>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">Address</DataList.Label>
                <DataList.Value>
                  <Link href="mailto:vlad@workos.com">vlad@workos.com</Link>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Box>
        </motion.div>
      </div>
    </div>
  );
};

export default TabsLayout;
