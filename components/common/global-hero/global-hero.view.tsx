import { ReactNode } from "react";

import clsx from "clsx";

import useBreakPoint from "x-hooks/use-breakpoint";


interface Info {
  value: ReactNode;
  label: ReactNode;
}
interface GlobalHeroProps {
  infos: Info[];
}
export default function GlobalHero ({
  infos
}: GlobalHeroProps) {
  const { isMobileView } = useBreakPoint();

  return(
    <div className="row mt-4 pt-2 mb-5">
      {infos?.map(i => <div className="col">
        <div className="d-flex flex-column bg-gray-850 py-3 border-radius-16 text-center">
          <span
            className={clsx([
              "font-weight-medium text-white",
              isMobileView ? "base-medium" : "xl-semibold"
            ])}
          >
            {i?.value}
          </span>
          <span
            className={clsx([
              "font-weight-normal text-white",
              isMobileView ? "sm-regular" : "lg-medium"
            ])}
          >
            {i?.label}
          </span>
        </div>
      </div>)}
    </div>
  );
}