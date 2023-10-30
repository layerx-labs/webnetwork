export default function useBreakPointMocked (validateAgent?: boolean) {
  return {
    currentBreakPoint: "xl",
    isMobileView: false,
    isTabletView: false,
    isDesktopView: false,
  };
}