import { Button } from "@/components/ui/button";
import { MoveDown } from "lucide-react";
import React from "react";
const HeroSection: React.FC = () => {
  return (
    <section className="grid grid-rows-12 gap-4 px-4 max-w-[125rem] lg:h-screen justify-center">
      <div className="row-span-10 lg:row-span-6 text-main-3 text-center mx-auto pt-10 px-6 pb-10 w-[420px] lg:w-3/4 max-w-[125rem] bg-main-2">
        <h1 className="text-4xl lg:text-7xl  font-semibold  mb-4">
          H3MS-GCN : Empowering Home-based Rehabilitation
        </h1>
        <p className="w-full  mx-auto text-base lg:text-2xl ">
          Welcome to the cutting-edge solution for physical rehabilitation. We
          introduce <strong>H3MS-GCN</strong>, a novel hybrid multi-moment deep
          learning model and a companion web application, designed to help you
          or your patients accurately and reliably self-assess rehabilitation
          exercises right at home.
        </p>
        <div className="flex justify-center items-center gap-4  *:rounded-full *:p-6 sm:*:p-8 *:text-lg mt-10">
          <Button
            size="lg"
            variant="default"
            className="hover:shadow-2xl duration-200 transition-all"
          >
            {/* {loading && <Loader2 className="animate-spin mr-2" />} */}
            <a className="flex gap-2" href="/VnuRehabInstaller.msi" download>
              <img
                src="/icons/microsoft-svgrepo-com.svg"
                className="w-6 h-6 mr-2"
              />
              Download for Windows
            </a>
          </Button>
        </div>
      </div>
      <div className="row-span-2 lg:row-span-6 flex flex-col items-center justify-around lg:pt-20">
        <div className="flex justify-center items-center gap-2  *:text-main-3 max-w-[22.5rem] sm:max-w-full sm:w-full mx-auto">
          <p className="text-shadow-lg">
            Scroll down for more information on our features.
          </p>
          <MoveDown size={30} className=" animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
