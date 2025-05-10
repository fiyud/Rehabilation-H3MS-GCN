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
import { Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import { useAuth } from "@/lib";
const LandingHeader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthError, login } = useAuth();
  const handleLogin = async (formData: FormData) => {
    try {
      setLoading(true);
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const resp = await login(name, id);
      if (resp) {
        console.log("Logged in");
      }
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
    <header className="flex justify-between items-center p-4 w-full">
      <div className="bg-white text-white w-3/4 h-16 pl-4 rounded-full flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-2">
          <img src="/icons/vnurehab.svg" alt="Logo" className="h-10 w-10" />
          <h1 className="text-main-3 font-semibold text-2xl">VNU Rehab</h1>
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
        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="h-full w-30 p-2">
                <DialogTrigger asChild>
                  <Button className="h-full w-full rounded-full">Login</Button>
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
                Make sure you are a licensed doctor to use this application with
                given ID.
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
                    defaultValue="Tien Dat Nguyen"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="id" className="text-right">
                    Doctor's ID
                  </label>
                  <Input id="id" defaultValue="DT1234" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />}Save changes
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default LandingHeader;
