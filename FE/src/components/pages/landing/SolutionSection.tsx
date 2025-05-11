import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Atom,
  ChevronsLeftRightEllipsis,
  Crosshair,
  Hospital,
  HousePlug,
  Rocket,
} from "lucide-react";
import React from "react";
const SolutionSection: React.FC = () => {
  const solutionItems = [
    {
      icon: <Crosshair className="text-white" size={36} />,
      title: "Accurate and Reliable Assessment",
      description:
        "H3MS-GCN captures complex spatiotemporal relationships through five distinct processing streams: skeletal features, Mahalanobis joint distance, spatial frequency, topological, and statistical features. This comprehensive approach enables a more detailed and accurate assessment of exercise quality compared to existing methods.",
    },
    {
      icon: <Atom className="text-white" size={36} />,
      title: "Dynamic and Adaptive Modeling",
      description:
        "Our model incorporates advanced components like Dual Dynamic HyperGraph Neural Network (DDHG), which builds hypergraph structures with adaptive dynamic edge weighting. The Bidirectional GRU (BiGRU) effectively captures temporal dependencies in motion sequences, ensuring precise temporal analysis.",
    },
    {
      icon: <Rocket className="text-white" size={36} />,
      title: "Superior Performance",
      description:
        "In benchmarking tests using the KIMORE and UIPRMD datasets, H3MS-GCN consistently outperformed state-of-the-art methods, achieving significantly lower error rates across multiple evaluation metrics.",
    },
    {
      icon: <HousePlug className="text-white" size={36} />,
      title: "Real-Time Feedback at Home",
      description:
        "The web application provides patients with immediate feedback on their movement quality while performing exercises at home. This is enabled by 3D skeletal data collected via Kinect v2 sensors, processed in real-time through a client-server architecture using WebSocket protocols.",
    },
    {
      icon: <ChevronsLeftRightEllipsis className="text-white" size={36} />,
      title: "User-Friendly Interface",
      description:
        "The application offers detailed exercise instructions, displays real-time visual feedback, and generates comprehensive performance reports for long-term tracking.",
    },
    {
      icon: <Hospital className="text-white" size={36} />,
      title: "Patient Tracking and Management",
      description:
        "A dedicated management interface for physicians/therapists allows them to log in securely, monitor patient data and progress, and add new patients and manage existing ones.",
    },
  ];
  return (
    <section className="py-20 px-4  bg-main-5 max-w-[125rem]" id="solutions">
      <h1 className="text-center text-5xl mb-10 font-semibold ">
        <i>H3MS-GCN & Web Application</i>
      </h1>

      <div className="grid grid-cols-12 gap-2 px-30">
        {solutionItems.map((item, index) => (
          <Card
            key={index}
            className="col-span-12 md:col-span-6 p-4 py-6 bg-main-2 cursor-pointer"
          >
            <CardHeader>
              <CardTitle>
                <div className="inline-flex bg-main-3 p-2 rounded-lg shadow-lg ">
                  {item.icon}
                </div>
              </CardTitle>
              <CardTitle>
                <h1 className="text-2xl font-semibold text-primary-600">
                  {item.title}
                </h1>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg">{item.description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;
