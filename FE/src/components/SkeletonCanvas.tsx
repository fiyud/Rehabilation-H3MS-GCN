import React, { useRef, useEffect } from "react";

interface Joint {
  X: number;
  Y: number;
  Z: number;
  TrackingState: string;
}

interface Skeleton {
  TrackingId: number;
  Joints: { [jointName: string]: Joint };
  HandLeftState?: string;
  HandRightState?: string;
  ClippedEdges?: string[];
}

export interface Frame {
  Timestamp: string;
  Skeletons: Skeleton[];
}

interface Props {
  data?: Frame;
  width?: number;
  height?: number;
  sizingFactor?: number;
}
// Constants
const TRACKED_BONE_THICKNESS = 4;
const INFERRED_BONE_THICKNESS = 1;
const JOINT_RADIUS = 3;
const CLAMP_Z = 0.1;

// Kinect v2 Field of View
const FOV_X = 74 * (Math.PI / 180); // Horizontal ~70°
const FOV_Y = 60 * (Math.PI / 180); // Vertical ~60°

const jointPairs: [string, string][] = [
  ["Head", "Neck"],
  ["Neck", "SpineShoulder"],
  ["SpineShoulder", "SpineMid"],
  ["SpineMid", "SpineBase"],
  ["SpineShoulder", "ShoulderRight"],
  ["SpineShoulder", "ShoulderLeft"],
  ["SpineBase", "HipRight"],
  ["SpineBase", "HipLeft"],
  ["ShoulderRight", "ElbowRight"],
  ["ElbowRight", "WristRight"],
  ["WristRight", "HandRight"],
  ["ShoulderLeft", "ElbowLeft"],
  ["ElbowLeft", "WristLeft"],
  ["WristLeft", "HandLeft"],
  ["HipRight", "KneeRight"],
  ["KneeRight", "AnkleRight"],
  ["AnkleRight", "FootRight"],
  ["HipLeft", "KneeLeft"],
  ["KneeLeft", "AnkleLeft"],
  ["AnkleLeft", "FootLeft"],
];

const bodyColors = [
  "#FF0000",
  "#FFA500",
  "#00FF00",
  "#0000FF",
  "#4B0082",
  "#EE82EE",
];

export const SkeletonCanvas: React.FC<Props> = ({
  data,
  width = 512,
  height = 424,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !data) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const scaleX = width / 512;
    const scaleY = height / 424;
    ctx.translate((width - 512 * scaleX) / 2 + 60, (height - 424 * scaleY) / 2);
    ctx.scale(scaleX, scaleY);

    const projectJoint = (joint: Joint) => {
      let Z = joint.Z;
      if (joint.Z < 0) {
        Z = CLAMP_Z;
      }
      const x = (joint.X / (Z * Math.tan(FOV_X / 2))) * (512 / 2) + (512 / 2);
      const y = (-joint.Y / (Z * Math.tan(FOV_Y / 2))) * (424 / 2) + (424 / 2);
      return { x, y };
    };

    data.Skeletons.forEach((skeleton, i) => {
      const joints = skeleton.Joints;
      const stroke = bodyColors[i % bodyColors.length];

      const jointPoints: { [key: string]: { x: number; y: number } } = {};
      Object.keys(joints).forEach((jointName) => {
        const joint = joints[jointName];
        jointPoints[jointName] = projectJoint(joint);
      });

      // Draw bones
      jointPairs.forEach(([j1, j2]) => {
        const joint1 = joints[j1];
        const joint2 = joints[j2];
        const p1 = jointPoints[j1];
        const p2 = jointPoints[j2];

        if (!joint1 || !joint2 || !p1 || !p2) return;

        const bothTracked = joint1.TrackingState === "Tracked" && joint2.TrackingState === "Tracked";
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = bothTracked ? stroke : "gray";
        ctx.lineWidth = bothTracked ? TRACKED_BONE_THICKNESS : INFERRED_BONE_THICKNESS;
        ctx.stroke();
      });

      // Draw joints
      Object.entries(jointPoints).forEach(([name, point]) => {
        const joint = joints[name];
        if (!joint) return;

        ctx.beginPath();
        ctx.arc(point.x, point.y, JOINT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle =
          joint.TrackingState === "Tracked"
            ? "green"
            : joint.TrackingState === "Inferred"
            ? "yellow"
            : "gray";
        ctx.fill();
      });
      ctx.restore();
    });
  }, [data, width, height]);
  return (
    <canvas
      ref={canvasRef}
      className="absolute w-full h-full top-0 left-0 bg-transparent z-50"
    />
  );
};
