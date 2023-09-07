import { useState } from "react";

import MyNetworkPageView from "components/pages/profile/my-network/view";

import { useAppState} from "contexts/app-state";
import { NetworkSettingsProvider, useNetworkSettings } from "contexts/network-settings";
import { changeLoadState } from "contexts/reducers/change-load";

import { MINUTE_IN_MS } from "helpers/constants";

import {Network} from "interfaces/network";

import { SearchBountiesPaginated } from "types/api";
import { MyNetworkPageProps } from "types/pages";

import { useSearchNetworks } from "x-hooks/api/network";
import useChain from "x-hooks/use-chain";
import useReactQuery from "x-hooks/use-react-query";

interface MyNetworkProps {
  bounties: SearchBountiesPaginated;
}

export function MyNetwork({
  bounties
}: MyNetworkProps) {
  const [myNetwork, setMyNetwork] = useState<Network>();

  const { chain } = useChain();
  const { state, dispatch } = useAppState();
  const { setForcedNetwork } = useNetworkSettings();

  async function getNetwork() {
    const chainId = chain.chainId.toString();

    return useSearchNetworks({
      creatorAddress: state.currentUser.walletAddress,
      isClosed: false,
      chainId: chainId
    })
      .then(({ count , rows }) => {
        const savedNetwork = count > 0 ? rows[0] : undefined;

        if (savedNetwork)
          sessionStorage.setItem(`bepro.network:${savedNetwork.name.toLowerCase()}:${chainId}`,
                                 JSON.stringify(savedNetwork));

        setMyNetwork(savedNetwork);
        setForcedNetwork(savedNetwork);
        return rows;
      })
      .catch(error => console.debug("Failed to get network", error))
      .finally(() => dispatch(changeLoadState(false)));
  }
  
  const { invalidate } = useReactQuery( ["network", state.currentUser?.walletAddress, chain?.chainId?.toString()], 
                                        getNetwork,
                                        {
                                          enabled: !!state.currentUser?.walletAddress && !!chain,
                                          staleTime: MINUTE_IN_MS
                                        });

  return(
    <MyNetworkPageView
      myNetwork={myNetwork}
      bounties={bounties}
      updateEditingNetwork={invalidate}
    />
  );
}

export default function MyNetworkPage({
  bounties
}: MyNetworkPageProps) {
  return(
    <NetworkSettingsProvider>
      <MyNetwork bounties={bounties} />
    </NetworkSettingsProvider>
  );
}