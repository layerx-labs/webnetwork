import { ReactElement, useState } from "react";

import { useRouter } from "next/router";

import VotingPowerMultiNetworkView from "components/profile/pages/voting-power/multi-network/view";

import { QueryKeys } from "helpers/query-keys";

import { Curator } from "interfaces/curators";

import { useSearchCurators } from "x-hooks/api/curator";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";

export default function VotingPowerMultiNetwork() {
  const { push } = useRouter();

  const [network, setNetwork] = useState<Curator>();

  const { currentUser } = useUserStore();
  const { getURLWithNetwork } = useMarketplace();

  function getNetworksVotingPower() {
    return useSearchCurators({
      address: currentUser?.walletAddress,
    })
      .then(({ rows }) => rows);
  }

  const { data: networks } = useReactQuery( QueryKeys.votingPowerMultiOf(currentUser?.walletAddress),
                                            getNetworksVotingPower,
                                            { enabled: !!currentUser?.walletAddress });

  function goToNetwork(network) {
    push(getURLWithNetwork("/tasks", {
          network: network?.name
    }));
    
  }

  function handleNetwork(network: Curator) {
    setNetwork(network)
  }

  function handleIconNetwork(icon: string, color: string): string | ReactElement {
    const  className = "mx-1 circle-3"

    const SecondaryIconProps = color ? {
      className,
      style: { backgroundColor: color }
    }: { className: `${className} bg-primary`}

    return icon ? icon : (
      <div {...SecondaryIconProps} />
    )
  }

  function clearNetwork() {
    setNetwork(undefined)
  }

  return (
    <VotingPowerMultiNetworkView
      networks={networks}
      network={network}
      handleNetwork={handleNetwork}
      clearNetwork={clearNetwork}
      goToNetwork={goToNetwork}
      handleIconNetwork={handleIconNetwork}
    />
  );
}
