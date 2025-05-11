import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-main-2 max-w-[125rem] p-10 justify-center  w-full">
      <div className="flex justify-between pb-10">
        <div className="flex items-center gap-4">
          <img
            src="/icons/vnurehab.svg"
            className="h-12 w-12 object-cover"
            alt="vnu logo"
          />
          <h1 className="text-3xl font-semibold">VNU Rehabilitation</h1>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder="Email" />
          <Button type="submit">Subscribe</Button>
        </div>
      </div>
      <div className="flex justify-end">
        <p>&copy; 2025 VNU REHAB. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
