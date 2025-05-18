import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Boxes } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

const TeamSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = () => {
        containerRef.current &&
          setWidth(
            containerRef.current?.scrollWidth -
              containerRef.current?.offsetWidth || 0
          );
      };

      updateWidth();
      window.addEventListener("resize", updateWidth);

      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  const team = [
    {
      image: "/images/",
      name: "Ngo Phuong Hoa",
      education: "Applied Information Technology",
      expertise: "Deep learning, rehabilitation systems.",
      role: "Team Leader",
    },
    {
      image: "/images/quang-anh.jpg",
      name: "Nguyen Duc Quang Anh",
      education: "Applied Information Technology ",
      expertise: "Data analysis, system optimization.",
      role: "AI Engineer",
    },
    {
      image: "/images/pham-duc.jpg",
      name: "Pham Minh Duc",
      education: "Computer and Information Science ",
      expertise: "Machine learning, computer vision.",
      role: "AI Engineer",
    },
    {
      image: "/images/tien-dat.jpg",
      name: "Nguyen Tien Dat",
      education: "Software Engineering ",
      expertise: "Full-stack development, UI/UX design.",
      role: "Application Developer",
    },
    {
      image: "/images/quoc-bao.jpg",
      name: "Doan Quoc Bao",
      education: "Software Engineering",
      expertise: "Software architecture, Full-stack development.",
      role: "Application Developer",
    },
  ];
  return (
    <section className="hidden lg:flex py-10 md:py-20 bg-main-2 px-4">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="bg-main-3 p-4 rounded-lg shadow-lg">
          <Boxes className="text-main-2 w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]" />
        </div>
        <h1 className="lg:text-5xl text-2xl  text-main-3 font-semibold text-start">
          Meet Our Team
        </h1>
      </div>
      <div className="overflow-y-scroll lg:overflow-hidden mx-auto lg:max-w-7xl py-4 md:py-10 relative">
        <motion.div ref={containerRef} className="cursor-grab ">
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            initial={{ x: 0 }}
            animate={{ x: [-width, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 20,
              ease: "linear",

              stiffness: 100,
            }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="min-w-[240px] md:min-w-[300px] mx-4 bg-white rounded-lg shadow-lg"
              >
                <Card className="border-none shadow-none h-full flex flex-col justify-between">
                  <CardHeader>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-48 object-cover  rounded-t-lg"
                    />
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{member.education}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start">
                    {member.expertise?.split(",").map((exp, expIndex) => (
                      <Badge key={expIndex}>{exp}</Badge>
                    ))}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Fade masks */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-main-2 to-transparent z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-main-2 to-transparent z-10"></div>
      </div>
    </section>
  );
};
export default TeamSection;
