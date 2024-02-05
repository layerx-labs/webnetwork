import {ResponsiveEle} from "components/responsive-wrapper";

import useBreakPoint from "x-hooks/use-breakpoint";

export function ContainerTypeFlex({ children }) {
  const {isMobileView} = useBreakPoint(true);

  const className = [
    "d-flex border-top border-gray-700 py-3 px-2", ... isMobileView ? ["flex-column"] : [""]
  ].join(" ")

  return <ResponsiveEle mobileView={children} className={className} />;
}
