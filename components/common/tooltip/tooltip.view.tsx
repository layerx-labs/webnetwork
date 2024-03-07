import { ReactNode } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

type Tooltip = {
  children: ReactNode,
  tip: string,
};

export function Tooltip({
  children,
  tip,
}: Tooltip) {
  const popover = (
    <Popover id={tip} className="p-1 bg-white">
      <Popover.Body
        as="p"
        className="sm-regular font-weight-medium m-0 p-1"
      >
        {tip}
      </Popover.Body>
    </Popover>
  );

  return(
    <OverlayTrigger placement="bottom" overlay={popover}>
      <div>
        {children}
      </div>
    </OverlayTrigger>
  );
}