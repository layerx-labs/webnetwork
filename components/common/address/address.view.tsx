import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { truncateAddress } from "helpers/truncate-address";

type Address = {
  address: string,
  className?: string,
  truncate?: boolean,
}

export function Address ({
  address,
  className,
  truncate,
}: Address) {
  const renderAddress = truncate ? truncateAddress(address) : address;

  return (
    <OverlayTrigger
      key="right"
      placement="right"
      overlay={
        (truncate && <Tooltip id={"tooltip-right"}>{address}</Tooltip>) || (
          <></>
        )
      }
    >
      <span className={className}>
        {renderAddress}
      </span>
    </OverlayTrigger>
  );
}