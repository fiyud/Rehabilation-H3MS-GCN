import {
  ChallengesSection,
  HeroSection,
  IntroductionSection,
  SolutionSection,
  TeamSection,
} from "@/components";
import { LandingLayout } from "@/layouts";
import React from "react";
const Landing: React.FC = () => {
  return (
    <LandingLayout>
      <HeroSection />
      <IntroductionSection />
      <SolutionSection />
      <TeamSection />
      <ChallengesSection />
    </LandingLayout>
  );
};

export default Landing;
