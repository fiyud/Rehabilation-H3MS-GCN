import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TeamSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(
        containerRef.current.scrollWidth - containerRef.current.offsetWidth
      );
    }
  }, []);

  const team = [
    {
      image: "/images/",
      name: "Ngo Phuong Hoa",
      education: "Applied Information Technology (AIT2023A)",
      expertise: "Deep learning, rehabilitation systems.",
      role: "Team Leader",
    },
    {
      image: "/images/quang-anh.jpg",
      name: "Nguyen Duc Quang Anh",
      education: "Applied Information Technology (AIT2022A)",
      expertise: "Data analysis, system optimization.",
      role: "AI Engineer",
    },
    {
      image: "/images/pham-duc.jpg",
      name: "Pham Minh Duc",
      education: "Computer and Information Science (K65A3)",
      expertise: "Machine learning, computer vision.",
      role: "AI Engineer",
    },
    {
      image: "/images/tien-dat.jpg",
      name: "Nguyen Tien Dat",
      education: "Software Engineering (HE180012)",
      expertise: "Front-end development, UI/UX design.",
      role: "Application Developer",
    },
    {
      image: "/images/quoc-bao.jpg",
      name: "Doan Quoc Bao",
      education: "Software Engineering (HE180053)",
      expertise: "Software architecture, full-stack development.",
      role: "Application Developer",
    },
  ];
  return (
    <section className="py-20 bg-main-2 px-4">
      <h1 className="text-5xl text-main-3 font-semibold text-center">
        Meet Our Team
      </h1>
      <div className="overflow-hidden mx-auto max-w-7xl py-10 relative">
        <motion.div ref={containerRef} className="cursor-grab">
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
            }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] mx-4 bg-white rounded-lg shadow-lg"
              >
                <Card className="border-none shadow-none ">
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
