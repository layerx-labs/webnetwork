import { ReactNode } from "react";

import ResponsiveWrapper from "components/responsive-wrapper";

interface CardProps {
  currentStep: number;
  maxSteps: number;
  children: ReactNode;
}
export default function CreateBountyCard({
  currentStep,
  maxSteps,
  children,
}: CardProps) {
  
  function Card({ children }) {
    return (
      <>
        <ResponsiveWrapper className="mx-3 flex-column" xs={true} md={false}>
          {children}
        </ResponsiveWrapper>
        <ResponsiveWrapper
          className="mx-2 flex-column bg-gray-900 p-4 border-radius-4 border border-gray-850"
          xs={false}
          md={true}
        >
          {children}
        </ResponsiveWrapper>
      </>
    );
  }

  return (
    <Card>
      <span className="text-gray">
        Step {currentStep} of {maxSteps}
      </span>
      {children}
    </Card>
  );
}
