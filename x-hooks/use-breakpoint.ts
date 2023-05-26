import { useEffect, useState } from "react";

import { BOOTSTRAP_BREAKPOINTS } from "helpers/constants"

const getCurrentBreakPoint = (currentWidth: number) => {
  if (currentWidth < BOOTSTRAP_BREAKPOINTS.sm) return "xs";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.md) return "sm";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.lg) return "md";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.xl) return "lg";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.xxl) return "xl";

  return "xxl";
}

export default function useBreakPoint() {
  const [currentBreakPoint, setCurrentBreakpoint] = useState<string>(getCurrentBreakPoint(window.innerWidth));

  const isMobileView = ["xs", "sm", "md"].includes(currentBreakPoint);

  const isTabletView = currentBreakPoint === "lg";

  const isDesktopView = ["xl", "xxl"].includes(currentBreakPoint);

  useEffect(() => {
    const observer = new ResizeObserver(() => setCurrentBreakpoint(getCurrentBreakPoint(window.innerWidth)));
    
    observer.observe(document.documentElement);
    
    return () => observer.disconnect();
  }, []);

  return {
    currentBreakPoint,
    isMobileView,
    isTabletView,
    isDesktopView,
  };
}