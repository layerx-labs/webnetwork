import { ReactNode } from "react";

import clsx from "clsx";

import { Tooltip } from "components/common/tooltip/tooltip.view";

import useBreakPoint from "x-hooks/use-breakpoint";


interface Info {
  value: ReactNode;
  label: ReactNode;
  tip: string;
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
      {infos?.map(i => <div className="col" key={i?.label?.toString()}>
        <div className="d-flex flex-column bg-gray-850 py-3 border-radius-16 text-center">
          <span
            className={clsx([
              "font-weight-medium text-white",
              isMobileView ? "base-medium" : "xl-semibold"
            ])}
          >
            {i?.value}
          </span>

          <Tooltip tip={i?.tip}>
            <span
              className={clsx([
                "font-weight-normal text-white",
                isMobileView ? "sm-regular" : "lg-medium"
              ])}
            >
              {i?.label}
            </span>
          </Tooltip>
        </div>
      </div>)}
    </div>
  );
}