import { ReactElement } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { OverlayDelay } from "react-bootstrap/esm/OverlayTrigger";

type Tooltip = {
  children: ReactElement,
  tip: string,
  delay?: OverlayDelay,
};

export function Tooltip({
  children,
  tip,
  delay = { show: 400, hide: 100 }
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
    <OverlayTrigger placement="bottom" overlay={popover} delay={delay}>
      {children}
    </OverlayTrigger>
  );
}