import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const ChallengesSection: React.FC = () => {
  const faqs = [
    {
      id: 1,
      question: "What makes assessing rehabilitation exercises difficult?",
      answer:
        "One major difficulty is the inherent variability in how patients perform exercises. Existing methods often struggle to capture this complexity and the important spatio-temporal relationships in movements.",
    },
    {
      id: 2,
      question:
        "Why aren't older methods like using rules or templates effective anymore?",
      answer:
        "Traditional methods rely on fixed rules or patterns set by experts, making them inflexible. They can't easily adapt to the unique ways individuals move or to common errors seen in real-life rehabilitation sessions.",
    },
    {
      id: 3,
      question:
        "How does using sensors like Kinect create problems for assessment?",
      answer:
        "Methods currently used are very sensitive to noise and errors that come from sensors like Kinect. This leads to inaccurate evaluations, particularly when patients are exercising at home where conditions aren't controlled. Studies show their accuracy significantly decreases with noisy data.",
    },
    {
      id: 4,
      question:
        "Can't standard AI methods like CNNs and RNNs solve these problems?",
      answer:
        "While explored, these methods need a lot of high-quality data for training and don't effectively model the spatial connections between body joints, which are vital for understanding complex movements. They can also require complicated setup steps.",
    },
    {
      id: 5,
      question:
        "What are the specific limitations of current Graph Convolutional Network (GCN) models for rehabilitation?",
      answer:
        "Existing GCN models have issues like inefficiently combining different features, relying on skeletal structures that don't adjust well to how people move differently, and difficulty understanding complex relationships between joints that aren't directly connected.",
    },
    {
      id: 6,
      question:
        "Is it difficult to monitor patients continuously during rehabilitation, especially at home?",
      answer:
        "Yes, providing consistent and accurate monitoring, particularly for patients doing exercises by themselves at home, is a significant practical challenge for rehabilitation programs.",
    },
    {
      id: 7,
      question:
        "Are there technical issues with using a web application for this kind of system?",
      answer:
        "There can be technical difficulties ensuring browser compatibility for capturing motion data. The system uses alternative solutions, such as the OBS Virtual Camera setup, to help overcome this.",
    },
  ];
  return (
    <section
      id="challenges"
      className=" px-4 max-w-[125rem] py-20 justify-center  bg-main-1"
    >
      <div className="text-center">
        <h1 className="text-5xl font-semibold">Frequently Asked Questions</h1>
        <p className="my-4 text-gray-700">
          Question we get about challenges in the project.
        </p>
      </div>
      <div className="grid grid-cols-12 gap-10 px-4 pt-10">
        <Accordion
          type="single"
          className="w-full h-full col-span-8 md:col-span-8 lg:col-span-8 mx-auto "
          collapsible
        >
          {!!faqs?.length &&
            faqs.map((item) => (
              <AccordionItem value={`item-${item.id}`} key={item.id}>
                <AccordionTrigger>
                  <h1 className="text-[1rem] font-semibold">{item.question}</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700 ">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
        <div className="col-span-4 bg-main-8 rounded-lg shadow-lg  flex flex-col items-center justify-center p-10 text-center gap-4">
          <h1 className="text-3xl">Don&apos;t see the answer you need?</h1>
          <p className="text-gray-700">
            That&apos;s okay. Just drop a message and we will get back to you
            ASAP
          </p>
          <Button
            className="py-6"
            onClick={() =>
              (window.location.href = "mailto:tiendatntd204@gmail.com")
            }
          >
            <Mail />
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
