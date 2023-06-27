import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useAppState } from "contexts/app-state";

import { Curator } from "interfaces/curators";

import useApi from "x-hooks/use-api";
import { useNetwork } from "x-hooks/use-network";

import VotingPowerMultiNetworkView from "./view";

export default function VotingPowerMultiNetwork() {
  const { push } = useRouter();

  const [networks, setNetworks] = useState<Curator[]>([]);

  const { state } = useAppState();
  const { searchCurators } = useApi();
  const { getURLWithNetwork } = useNetwork();

  function goToNetwork(network) {
    return () => {
      push(getURLWithNetwork("/bounties", {
          network: network?.name,
          chain: network?.chain?.chainShortName,
      }));
    };
  }

  useEffect(() => {
    if (state.currentUser?.walletAddress)
      searchCurators({
        address: state.currentUser?.walletAddress,
      })
        .then(({ rows }) => setNetworks(rows))
        .catch((error) =>
          console.debug("Failed to fetch voting power data", error));
  }, [state.currentUser?.walletAddress]);

  return (
    <VotingPowerMultiNetworkView
      networks={networks}
      goToNetwork={goToNetwork}
    />
  );
}
