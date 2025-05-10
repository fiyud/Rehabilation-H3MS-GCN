import { Sidebar } from "@/components";
import { useAuth, useExercise } from "@/lib";
import { useLocation } from "react-router";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { SelectContent } from "@radix-ui/react-select";
import { isAxiosError } from "axios";
import { Bell, Cog, Loader2 } from "lucide-react";
import React, { useState } from "react";
const TabsLayout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, user, setAuthError, authError, login, logout } =
    useAuth();
  const { pathname } = useLocation();
  const { setSearch } = useExercise();

  return (
    <div className="flex min-w-screen h-svh">
      <Sidebar />
      <div className="w-full bg-white grid grid-rows-12 p-6 gap-2">
        <div className="row-span-1 grid grid-cols-12 items-center">
          <div className="col-span-3 flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <a className="bg-transparent cursor-pointer flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/glass/svg?seed=${user?.name}`}
                    />
                    <AvatarFallback className="bg-[#161616] text-[#ccc]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="text-main-3 font-bold">{user?.name}</div>
                    <div className="text-gray-700 text-sm">#{user?.id}</div>
                  </div>
                </a>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setDrawerOpen(true)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem color="red" onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="col-span-6 flex items-center gap-4">
            <Input
              placeholder="Search the docs…"
              className="cursor-alias bg-main-8 text-white"
              disabled={pathname.substring(1) != "statistics"}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <div>
              <Select
                defaultValue="patients"
                disabled={pathname.substring(1) != "statistics"}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patients">Patients</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </ul>
        </div>
        <div className="row-span-11 max-h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default TabsLayout;
