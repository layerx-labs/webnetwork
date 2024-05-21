import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { SizeOptions } from "interfaces/utils";

export default function Avatar({
  userLogin,
  className,
  src,
  tooltip = false,
  size = "sm"
}: {
  userLogin: string;
  className?: string;
  src?: string;
  tooltip?: boolean;
  size?: SizeOptions | number;
}) {
  const SIZES = {
    xsm: 1,
    sm: 3,
    md: 4,
    lg: 5
  };

  if (src)
    return (
      <OverlayTrigger
        key="right"
        placement="right"
        overlay={
          (tooltip && <Tooltip id={"tooltip-right"}>@{userLogin}</Tooltip>) || (
            <></>
          )
        }
      >
        <img
          className={`avatar circle-${SIZES[size] || size} ${className}`}
          src={src}
        />
      </OverlayTrigger>
    );

  return <></>;
}
