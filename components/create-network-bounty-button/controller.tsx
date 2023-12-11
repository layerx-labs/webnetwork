import { useState } from "react";

import {useRouter} from "next/router";

import CreateNetworkBountyButtonView from "components/create-network-bounty-button/view";

interface CreateNetworkBountyButtonProps {
  label?: string;
}

export default function CreateNetworkBountyButton({
  label
}: CreateNetworkBountyButtonProps) {
  const { pathname, push } = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const isOnNetwork = pathname?.includes("[network]");

  function onClick () {
    if (!isOnNetwork) {
      setIsModalVisible(true);
      return;
    }
    push("/create-task");
  }

  function onCloseClick () {
    setIsModalVisible(false);
  }

  return(
    <CreateNetworkBountyButtonView
      isOnNetwork={isOnNetwork}
      isModalVisible={isModalVisible}
      onClick={onClick}
      onCloseClick={onCloseClick}
      label={label}
    />
  );
}