import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { Button } from "@radix-ui/themes";
import { HouseWifi, ScanEye, Dumbbell, Video } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
      className={`flex ${
        isOpen ? "w-44" : "w-20"
      } transition-all duration-200 ease-in-out bg-[#101010] text-white min-h-screen`}
    >
      <div className="w-full">
        <div className="flex flex-col items-center my-6">
          <Button
            className="bg-transparent hover:bg-[#3e3e3e] px-2 py-4 border-none cursor-pointer"
            onClick={toggleSidebar}
          >
            <ScanEye size={24} />
          </Button>
        </div>

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
                  }`}
                >
                  <HouseWifi className="group-hover:text-[#ccc] duration-200" />
                  <h1
                    className={`text-[1rem] group-hover:text-[#ccc] transition-all duration-200 ease-in-out transform  ${
                      !isOpen ? "hidden" : "block"
                    }`}
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
                  }`}
                >
                  <Video className="group-hover:text-[#ccc] duration-200" />
                  <h1
                    className={`text-[1rem] group-hover:text-[#ccc] transition-all duration-200 ease-in-out transform  ${
                      !isOpen ? "hidden" : "block"
                    }`}
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
                  }`}
                >
                  <Dumbbell className="group-hover:text-[#ccc] duration-200" />
                  <h1
                    className={`text-[1rem] group-hover:text-[#ccc] transition-all duration-200 ease-in-out transform  ${
                      !isOpen ? "hidden" : "block"
                    }`}
                  >
                    Exercises
                  </h1>
                </Link>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Sidebar;
