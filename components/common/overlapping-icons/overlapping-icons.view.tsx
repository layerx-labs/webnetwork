import React, { ReactElement } from "react";

import clsx from "clsx";

import If from "components/If";

interface OverlappingIconsProps {
  icons: ReactElement[];
  limit?: number;
  onMoreClick?: (e) => void;
}

export function OverlappingIcons({
  icons,
  limit = 3,
  onMoreClick
}: OverlappingIconsProps) {
  const hiddenIcons = icons?.length - limit;
  const hasOnClick = !!onMoreClick;

  return(
    <div className="d-flex align-items-center">
      {icons?.slice(0, limit)?.map((icon, index) => 
        <div className="mx-n1" key={`icons-${index}`}>
          {React.cloneElement(icon, { className: "bg-gray-850 border border-gray-700 circle-2" })}
        </div>)
      }
      <If condition={hiddenIcons > 0}>
        <div className="mx-n1">
          <span 
            className={clsx([
              "xs-small p-1 font-weight-normal text-gray-500 circle-2 bg-gray-850 border border-gray-800",
              hasOnClick && "text-white-hover border-white-hover",
            ])}
            onClick={onMoreClick}
            role={hasOnClick ? "button": "none"}
          >
            +{hiddenIcons}
          </span>
        </div>
      </If>
    </div>
  );
}