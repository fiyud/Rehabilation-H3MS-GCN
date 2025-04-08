import { Avatar, Button, Select, Separator, TextField } from "@radix-ui/themes";
import { Bell, Cog, Search } from "lucide-react";
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
          </ul>
        </div>
        <div className="row-span-11">{children}</div>
      </div>
    </div>
  );
};

export default TabsLayout;
