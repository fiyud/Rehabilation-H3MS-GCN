import { Bot, Projector, Proportions, SquareActivity } from "lucide-react";
import React from "react";
const IntroductionSection: React.FC = () => {
  const introItems = [
    {
      icon: <SquareActivity className="text-main-2" size={30} />,
      title: "Exercise-based Rehabilitation Benefits",
      description:
        "Exercise-based rehabilitation programs offer substantial benefits for patient well-being, including improved quality of life, reduced mortality rates, and decreased need for hospital readmissions. Research supports its effectiveness, for example, in significantly lowering cardiovascular mortality and reducing hospital stays for cardiac rehabilitation.",
    },
    {
      icon: <Bot className="text-main-2" size={30} />,
      title: "AI in Rehabilitation",
      description:
        "The integration of Artificial Intelligence (AI) is transforming rehabilitation by enabling innovative solutions such as AI-driven virtual systems that empower patients to perform prescribed exercises independently at home.",
    },
    {
      icon: <Proportions className="text-main-2" size={30} />,
      title: "Advanced AI Solutions",
      description:
        "These AI-driven systems, like the desktop application implementing the H3MS-GCN model, utilize advanced algorithms to analyze patient movements, provide real-time personalized feedback, and generate comprehensive performance reports, potentially enhancing adherence and optimizing recovery outcomes.",
    },
  ];

  return (
    <section className="py-20 px-4  bg-main-1 max-w-[125rem]" id="introduction">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="bg-main-3 p-4 rounded-lg shadow-lg">
          <Projector size={50} className="text-main-2" />
        </div>
        <h2 className="text-5xl text-main-3 font-semibold text-center">
          Introduction to H3MS-GCN
        </h2>
      </div>
      <dl className="flex h-full justify-between">
        {introItems.map((item, index) => (
          <div key={index} className="items-center gap-4 p-6">
            <div className="bg-main-3 p-4 rounded-lg shadow-lg inline-flex mb-4">
              {item.icon}
            </div>
            <div>
              <dt className="text-xl font-semibold mb-2 text-primary-600">
                {item.title}
              </dt>
              <dd className="relative group text-gray-700 text-[1rem] font-light max-h-[75px] overflow-hidden transition-[max-height] duration-300 ease-in-out hover:max-h-[25rem]">
                {item.description}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default IntroductionSection;
