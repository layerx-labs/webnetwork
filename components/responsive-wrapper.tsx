import {ReactNode} from "react";

import clsx from "clsx";

import { BreakpointOptions } from "types/utils";

import useBreakPoint from "../x-hooks/use-breakpoint";

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

type ResponsiveProps = {

  /**
   * What to present on which view;
   *  If mobile exists, but not tablet; then tablet will be the same as mobile
   *  If tablet exists, but not desktop; then desktop will be the same as tablet
   *
   * Use `[mobile|tablet|desktop]View: null` to explicitly hide something on a specific view
   *  */
  mobileView?: string | ReactNode | null;
  tabletView?: string | ReactNode | null;
  desktopView?: string | ReactNode | null;

  /**
   * Provide more classes as needed but avoid doing so;
   * Sizing should be done on the parent or child component - not on the wrapper.
   * Rowing should be done on the parent or child component - not on the wrapper.
   * @deprecated
   * */
  "className"?: string;

};

export function ResponsiveEle({
                                desktopView,
                                tabletView,
                                mobileView,
                                className = ""
                              }: ResponsiveProps) {
  const {isMobileView, isTabletView, isDesktopView} = useBreakPoint();

  if (mobileView && tabletView === undefined)
    tabletView = mobileView;
  if (tabletView && desktopView === undefined)
    desktopView = tabletView;

  if (className)
    return (
      <div className={className}>
        {isMobileView && mobileView || isTabletView && tabletView || isDesktopView && desktopView || (<></>)}
      </div>
    )

  return <>{isMobileView && mobileView || isTabletView && tabletView || isDesktopView && desktopView || (<></>)}</>
}