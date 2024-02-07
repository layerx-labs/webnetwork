import { ReactNode } from "react";

import clsx from "clsx";

import { BreakpointOptions } from "types/utils";

import useBreakPoint from "x-hooks/use-breakpoint";

interface ResponsiveWrapperProps extends BreakpointOptions {
  children?: ReactNode;
  className?: string;
}

export default function ResponsiveWrapper({
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  children,
  className
} : ResponsiveWrapperProps) {
  const {
    currentBreakPoint
  } = useBreakPoint();

  const xsVisibility = xs ?? false;
  const smVisibility = sm ?? xsVisibility ?? false;
  const mdVisibility = md ?? smVisibility ?? false;
  const lgVisibility = lg ?? mdVisibility ?? false;
  const xlVisibility = xl ?? lgVisibility ?? false;
  const xxlVisibility = xxl ?? xlVisibility ?? false;

  const breakpoints = {
    xs: xsVisibility,
    sm: smVisibility,
    md: mdVisibility,
    lg: lgVisibility,
    xl: xlVisibility,
    xxl: xxlVisibility,
  };

  function getClass(condition, ifTrue, ifFalse) {
    if (typeof condition === "boolean")
      return condition ? ifTrue : ifFalse;

    return "";
  }

  if (!breakpoints[currentBreakPoint]) {
    return null;
  }

  return(
    <div 
      className={clsx([
        getClass(xs, "d-flex", "d-none"),
        getClass(sm, "d-sm-flex", "d-sm-none"),
        getClass(md, "d-md-flex", "d-md-none"),
        getClass(lg, "d-lg-flex", "d-lg-none"),
        getClass(xl, "d-xl-flex", "d-xl-none"),
        getClass(xxl, "d-xxl-flex", "d-xxl-none"),
        className,
      ])}
    >
      {children}
    </div>
  );
}