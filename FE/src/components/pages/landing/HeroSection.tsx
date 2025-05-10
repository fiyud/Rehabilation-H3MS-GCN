import { Button } from "@/components/ui/button";
import { MoveDown } from "lucide-react";
import React from "react";
const HeroSection: React.FC = () => {
  return (
    <section>
      <div className="text-main-3 text-center w-3/4 mx-auto py-20 pb-10 max-w-[125rem] bg-main-2">
        <h1 className="text-5xl leading-16 font-semibold  mb-4">
          H3MS-GCN : Empowering Home-based Rehabilitation with Intelligent
          Real-time Movement Assessment Technology
        </h1>
        <p className="w-4/5 mx-auto text-md ">
          Welcome to the cutting-edge solution for physical rehabilitation. We
          introduce <strong>H3MS-GCN</strong>, a novel hybrid multi-moment deep
          learning model and a companion web application, designed to help you
          or your patients accurately and reliably self-assess rehabilitation
          exercises right at home.
        </p>
      </div>
      <div className="flex justify-center items-center gap-4 mb-20 *:rounded-full *:p-8 *:text-lg">
        <Button
          size="lg"
          variant="default"
          className="hover:shadow-2xl duration-200 transition-all"
        >
          {/* {loading && <Loader2 className="animate-spin mr-2" />} */}
          <img
            src="/icons/microsoft-svgrepo-com.svg"
            className="w-6 h-6 mr-2"
          />
          Download for Windows
        </Button>
      </div>
      <div className="flex justify-center items-center gap-2 py-10 *:text-main-3">
        <p className="text-shadow-lg">
          Scroll down for more information on our features.
        </p>
        <MoveDown className=" animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
