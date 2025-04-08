import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { Button, Flex } from "@radix-ui/themes";
import {
  HouseWifi,
  ScanEye,
  Dumbbell,
  Video,
  StepBack,
  StepForward,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = useLocation().pathname.split("/")[1];
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <Flex
      justify={"between"}
      direction={"column"}
      className={` ${
        isOpen ? "w-44" : "w-20"
      } transition-all duration-200 ease-in-out bg-[#101010] text-white min-h-screen`}
    >
      <div className="w-full">
        <Flex className="my-6" align={"center"} justify={"center"}>
          <Flex gap={"2"} direction={"column"} align={"center"}>
            <ScanEye size={30} />
            {isOpen && (
              <h1 className="text-[20px] text-center font-bold ">
                Rehabilation-H3MS-GCN
              </h1>
            )}
          </Flex>
        </Flex>

        <NavigationMenu className="flex flex-col space-y-4">
          <NavigationMenuList className="space-y-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="border-none w-full bg-[#101010]">
                <Link
                  to="/"
                  className={`w-full *:text-[#373737] group ${
                    isOpen
                      ? "flex items-center gap-2"
                      : "flex flex-col items-center "
                  } ${path == "" ? "*:text-white" : ""}`}
                >
                  <HouseWifi className="group-hover:text-[#ccc] duration-200" />
                  <h1
                    className={`
                      text-[1rem] group-hover:text-[#ccc]
                      transition-all duration-300 ease-in-out
                      overflow-hidden whitespace-nowrap
                      ${
                        isOpen
                          ? "block opacity-100 max-w-[160px]"
                          : "hidden opacity-0 max-w-0"
                      }
                    `}
                  >
                    Trang chủ
                  </h1>
                </Link>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="border-none w-full bg-[#101010]">
                <Link
                  to="/obs-viewer"
                  className={`w-full *:text-[#373737] group ${
                    isOpen
                      ? "flex items-center gap-2"
                      : "flex flex-col items-center "
                  } ${path == "obs-viewer" ? "*:text-white" : ""}`}
                >
                  <Video className="group-hover:text-[#ccc] duration-200" />
                  <h1
                    className={`
                      text-[1rem] group-hover:text-[#ccc]
                      transition-all duration-300 ease-in-out
                      overflow-hidden whitespace-nowrap
                      ${
                        isOpen
                          ? "block opacity-100 max-w-[160px]"
                          : "hidden opacity-0 max-w-0"
                      }
                    `}
                  >
                    OBS Viewer
                  </h1>
                </Link>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="border-none w-full bg-[#101010]">
                <Link
                  to="/exercises"
                  className={`w-full *:text-[#373737] group ${
                    isOpen
                      ? "flex items-center gap-2"
                      : "flex flex-col items-center "
                  } ${path == "exercises" ? "*:text-white" : ""}`}
                >
                  <Dumbbell className="group-hover:text-[#ccc] duration-200" />
                  <h1
                    className={`
                      text-[1rem] group-hover:text-[#ccc]
                      transition-all duration-300 ease-in-out
                      overflow-hidden whitespace-nowrap
                      ${
                        isOpen
                          ? "block opacity-100 max-w-[160px]"
                          : "hidden opacity-0 max-w-0"
                      }
                    `}
                  >
                    Exercises
                  </h1>
                </Link>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        <Button
          className="w-full bg-[#1c1c1c]  rounded-none cursor-pointer py-6"
          onClick={toggleSidebar}
        >
          {isOpen ? <StepBack /> : <StepForward />}
        </Button>
      </div>
    </Flex>
  );
};

export default Sidebar;
