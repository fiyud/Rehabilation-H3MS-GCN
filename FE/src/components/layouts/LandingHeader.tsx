import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Loader2, LoaderCircle } from "lucide-react";
import { isAxiosError } from "axios";
import { useAuth } from "@/lib";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link } from "react-router";
const LandingHeader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthError, login, isAuthenticated, user } = useAuth();
  const handleLogin = async (formData: FormData) => {
    try {
      setLoading(true);
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      await login(name, id);
    } catch (error) {
      if (isAxiosError(error)) {
        setAuthError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const navigationItems = [
    { tag: "Introduction", href: "#introduction" },
    { tag: "Solutions", href: "#solutions" },
    { tag: "Challenges", href: "#challenges" },
    // { tag: "Features", href: "#features" },
  ];
  return (
    <header className="hidden sm:flex justify-between items-center p-4 w-full ">
      <div className="bg-white text-white  xl:w-3/4 w-full sm:h-18 md:h-18 px-4 lg:h-16 rounded-full flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-2">
          <img
            src="/icons/vnurehab.svg"
            alt="Logo"
            className="object-cover h-10 w-10"
          />
          <h1 className="text-main-3 font-semibold text-2xl md:text-xl sm:text-sm">
            VNU Rehab
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-4 ">
            {navigationItems.map((item) => (
              <li key={item.tag} className="inline-block mx-4">
                <a
                  href={item.href}
                  className="text-main-3 font-normal hover:font-medium hover:text-main-1 duration-200 transition-all"
                >
                  {item.tag}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {!user ? (
          <Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="h-full w-30 p-2">
                  <DialogTrigger asChild>
                    <Button className="h-full w-full rounded-full">
                      Login
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>For doctors only!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-[425px] bg-main-2">
              <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>
                  Make sure you are a licensed doctor to use this application
                  with given ID.
                </DialogDescription>
              </DialogHeader>
              <form action={handleLogin} method="post">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Doctor's Name"
                      name="name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="id" className="text-right">
                      Doctor's ID
                    </label>
                    <Input
                      id="id"
                      name="id"
                      placeholder="Doctor's Id"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  {loading && <LoaderCircle className="animate-spin" />}
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="animate-spin" />}Save
                    changes
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="p-2">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/glass/svg?seed=Doan`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <AvatarFallback className="bg-black text-black">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View account info</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/statistics">Statistics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/exercises">Exercises</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
