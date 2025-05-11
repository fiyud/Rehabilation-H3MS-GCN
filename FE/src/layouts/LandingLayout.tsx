import { LandingFooter, LandingHeader } from "@/components";
import React from "react";
const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-w-screen min-h-screen bg-main-2 items-center">
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
