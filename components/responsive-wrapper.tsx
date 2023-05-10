import { ReactNode } from "react";

import clsx from "clsx";

interface ResponsiveWrapperProps {
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
  xxl?: boolean;
  children?: ReactNode;
}

export default function ResponsiveWrapper({
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  children
} : ResponsiveWrapperProps) {
  function getClass(condition, ifTrue, ifFalse) {
    if (typeof condition === "boolean")
      return condition ? ifTrue : ifFalse;

    return "";
  }

  return(
    <div 
      className={clsx([
        getClass(xs, "d-flex", "d-none"),
        getClass(sm, "d-flex", "d-sm-none"),
        getClass(md, "d-flex", "d-md-none"),
        getClass(lg, "d-flex", "d-lg-none"),
        getClass(xl, "d-flex", "d-xl-none"),
        getClass(xxl, "d-flex", "d-xxl-none"),
      ])}
    >
      {children}
    </div>
  );
}