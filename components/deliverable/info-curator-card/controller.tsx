import { useState } from "react";

import { useNetwork } from "x-hooks/use-network";

import DeliverableInfoCardView from "./view";

export default function DeliverableInfoCuratorCard({
    defaultShowValue = true
}: {
    defaultShowValue?: boolean;
}) {

  const [show, setShow] = useState<boolean>(defaultShowValue);
  
  const { getURLWithNetwork } = useNetwork();

  const votingPowerHref = getURLWithNetwork("/profile/voting-power");

  function onHide() {
    setShow(false);
  }

  return (
    <DeliverableInfoCardView
      show={show}
      onHide={onHide}
      votingPowerHref={votingPowerHref}
    />
  );
}