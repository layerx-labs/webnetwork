import { useEffect, useState } from "react";

import { BOOTSTRAP_BREAKPOINTS } from "helpers/constants"

import useDebouncedCallback from "x-hooks/use-debounced-callback";

const getCurrentBreakPoint = (currentWidth: number) => {
  if (currentWidth < BOOTSTRAP_BREAKPOINTS.sm) return "xs";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.md) return "sm";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.lg) return "md";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.xl) return "lg";
  else if (currentWidth < BOOTSTRAP_BREAKPOINTS.xxl) return "xl";

  return "xxl";
}

const isMobileUserAgent = () => {
  if (!window) return false;

  const userAgentMatch = agent => !!navigator.userAgent.match(agent);

  if (userAgentMatch(/Android/i) ||
      userAgentMatch(/webOS/i) ||
      userAgentMatch(/iPhone/i) ||
      userAgentMatch(/iPad/i) ||
      userAgentMatch(/iPod/i) ||
      userAgentMatch(/BlackBerry/i) ||
      userAgentMatch(/Windows Phone/i))
    return true;

  return false;
}

export default function useBreakPoint(validateAgent = false) {
  const [currentBreakPoint, setCurrentBreakpoint] = useState<string>();
  const [userAgentCheck, setUserAgentCheck] = useState(false);

  const handler = () => setCurrentBreakpoint(getCurrentBreakPoint(window.innerWidth));
  const debouncedHandler = useDebouncedCallback(handler, 300);

  const isMobileView = ["xs", "sm", "md"].includes(currentBreakPoint) && userAgentCheck;
  const isTabletView = currentBreakPoint === "lg" && userAgentCheck;
  const isDesktopView = ["xl", "xxl"].includes(currentBreakPoint) && userAgentCheck;

  useEffect(() => {
    setUserAgentCheck(validateAgent ? isMobileUserAgent() : true);

    handler();

    const observer = new ResizeObserver(debouncedHandler);
    
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