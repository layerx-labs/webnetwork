import { ReactNode } from "react";

interface GradientBadgeProps {
  color?: "blue" | "purple";
  variant?: "outlined" | "filled";
  children: ReactNode;
}

export function GradientBadge({
  color = "blue",
  variant = "outlined",
  children,
}: GradientBadgeProps) {
  return(
    <div className={`gradient-badge-wrapper gradient-badge-wrapper-${color}`}>
      <div className={`gradient-badge-content gradient-badge-content-${variant}-${color}`}>
        {children}
      </div>
    </div>
  );
}