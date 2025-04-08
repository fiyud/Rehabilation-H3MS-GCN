import TabsLayout from "@/layouts/TabsLayout";
import React from "react";

const Exercises: React.FC = () => {
  const exercises = [
    {
      id: 1,
      name: "Deep Squat",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Toes pointing slightly outward",
        "Lower your body by bending your knees and hips",
        "Keep your chest up and back straight",
        "Go as low as you can while maintaining proper form",
        "Return to starting position by pushing through your heels",
      ],
      tips: "Keep your knees aligned with your toes and maintain a neutral spine throughout the movement.",
    },
    {
      id: 2,
      name: "Hurdle Step",
      instructions: [
        "Stand with feet hip-width apart",
        "Place a hurdle or object at knee height",
        "Lift one leg and step over the hurdle",
        "Keep your standing leg stable",
        "Step down with control on the other side",
        "Return to starting position and repeat with other leg",
      ],
      tips: "Maintain balance and control throughout the movement. Keep your core engaged.",
    },
    {
      id: 3,
      name: "Inline Lunge",
      instructions: [
        "Stand with feet together",
        "Step one foot backward in a straight line",
        "Lower your back knee toward the ground",
        "Keep your front knee aligned with your ankle",
        "Push through your front foot to return to start",
        "Repeat with other leg",
      ],
      tips: "Keep your torso upright and maintain balance throughout the movement.",
    },
    {
      id: 4,
      name: "Side Lunge",
      instructions: [
        "Stand with feet together",
        "Step one foot to the side",
        "Bend the stepping leg's knee",
        "Keep the other leg straight",
        "Push back to starting position",
        "Repeat on other side",
      ],
      tips: "Keep your chest up and maintain proper knee alignment over your toes.",
    },
    {
      id: 5,
      name: "Sit to Stand",
      instructions: [
        "Start seated in a chair",
        "Place feet shoulder-width apart",
        "Lean slightly forward",
        "Push through your heels to stand",
        "Keep your back straight",
        "Lower back down with control",
      ],
      tips: "Use your leg muscles to power the movement, not momentum.",
    },
    {
      id: 6,
      name: "Standing Active Straight Leg Raise",
      instructions: [
        "Stand on one leg",
        "Keep standing leg slightly bent",
        "Lift other leg straight in front",
        "Keep your back straight",
        "Hold briefly at the top",
        "Lower with control",
      ],
      tips: "Maintain balance and keep your core engaged throughout.",
    },
    {
      id: 7,
      name: "Standing Shoulder Abduction",
      instructions: [
        "Stand with arms at sides",
        "Raise arms out to the sides",
        "Keep elbows straight",
        "Raise to shoulder height",
        "Hold briefly",
        "Lower with control",
      ],
      tips: "Keep your shoulders down and away from your ears.",
    },
    {
      id: 8,
      name: "Standing Shoulder Extension",
      instructions: [
        "Stand with arms raised forward",
        "Keep elbows straight",
        "Move arms backward",
        "Keep your chest up",
        "Hold briefly",
        "Return to start",
      ],
      tips: "Maintain proper posture and control throughout the movement.",
    },
    {
      id: 9,
      name: "Standing Shoulder Internal-External Rotation",
      instructions: [
        "Stand with elbow bent at 90 degrees",
        "Keep elbow at your side",
        "Rotate arm inward",
        "Then rotate outward",
        "Keep your wrist straight",
        "Repeat for desired reps",
      ],
      tips: "Keep your elbow stable at your side throughout the rotation.",
    },
    {
      id: 10,
      name: "Standing Shoulder Scaption",
      instructions: [
        "Stand with arms at sides",
        "Raise arms at 45-degree angle",
        "Keep thumbs pointing up",
        "Raise to shoulder height",
        "Hold briefly",
        "Lower with control",
      ],
      tips: "Keep your shoulders down and maintain proper form throughout.",
    },
  ];

  return (
    <TabsLayout>
      <h1 className="text-[2.5rem] font-bold my-6 text-white">
        Exercise Instructions
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-[#242424] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {exercise.name}
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-gray-300">
                Instructions:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-300">Tips:</h3>
              <p className="text-gray-300">{exercise.tips}</p>
            </div>
          </div>
        ))}
      </div>
    </TabsLayout>
  );
};

export default Exercises;
