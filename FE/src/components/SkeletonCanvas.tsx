import { useEffect, useRef } from "react";

interface Joint {
  X: number;
  Y: number;
  Z: number;
  TrackingState: string;
}

interface Skeleton {
  TrackingId: number;
  Joints: { [jointName: string]: Joint };
}

export interface Frame {
  Timestamp: string;
  Skeletons: Skeleton[];
}

interface Props {
  data?: Frame;
}

const jointPairs: [string, string][] = [
  ["SpineBase", "SpineMid"],
  ["SpineMid", "Neck"],
  ["Neck", "Head"],
  ["ShoulderLeft", "ElbowLeft"],
  ["ElbowLeft", "WristLeft"],
  ["WristLeft", "HandLeft"],
  ["ShoulderRight", "ElbowRight"],
  ["ElbowRight", "WristRight"],
  ["WristRight", "HandRight"],
  ["SpineShoulder", "ShoulderLeft"],
  ["SpineShoulder", "ShoulderRight"],
  ["SpineBase", "HipLeft"],
  ["SpineBase", "HipRight"],
  ["HipLeft", "KneeLeft"],
  ["KneeLeft", "AnkleLeft"],
  ["AnkleLeft", "FootLeft"],
  ["HipRight", "KneeRight"],
  ["KneeRight", "AnkleRight"],
  ["AnkleRight", "FootRight"],
];

export const SkeletonCanvas: React.FC<Props> = ({ data }) => {
  if (!data) {
    return null;
  }
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // follow video orientation

    // Calculate a dynamic scale factor based on skeleton height
    let scale = 80; // Default scale

    // if (data.Skeletons.length > 0) {
    //   const joints = data.Skeletons[0].Joints;
    //   if (
    //     joints["Head"] &&
    //     joints["FootLeft"] &&
    //     joints["Head"].TrackingState !== "Inferred" &&
    //     joints["FootLeft"].TrackingState !== "Inferred"
    //   ) {
    //     const skeletonHeight = Math.abs(
    //       joints["Head"].Y - joints["FootLeft"].Y
    //     );

    //     const targetHeight = canvas.height * 0.7; 

    //     if (skeletonHeight > 0) {
    //       scale = targetHeight / skeletonHeight;
    //       console.log(
    //         "Dynamic scale:",
    //         scale,
    //         "Skeleton height:",
    //         skeletonHeight
    //       );
    //     }
    //   }
    // }
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    console.log(data.Skeletons);
    const skeleton = data.Skeletons[0];
    const joints = skeleton.Joints;

    // Draw bones
    jointPairs.forEach(([from, to]) => {
      const j1 = joints[from];
      const j2 = joints[to];
      if (
        j1 &&
        j2 &&
        j1.TrackingState !== "Inferred" &&
        j2.TrackingState !== "Inferred"
      ) {
        ctx.beginPath();
        ctx.moveTo(j1.X * scale + offsetX + 6, -j1.Y * scale + offsetY + 4);
        ctx.lineTo(j2.X * scale + offsetX + 6, -j2.Y * scale + offsetY + 4);
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw joints
    Object.entries(joints).forEach(([_, joint]) => {
      if (joint.TrackingState !== "Inferred") {
        ctx.beginPath();
        ctx.arc(
          joint.X * scale + offsetX + 6,
          -joint.Y * scale + offsetY + 4,
          3,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#00FF00";
        ctx.fill();
      }
    });
  }, [data]);
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute top-0 left-0 z-100"
    />
  );
};
