import { useEffect } from "react";

import MyNetworkPageView from "components/pages/profile/my-network/view";

import { useAppState} from "contexts/app-state";
import { NetworkSettingsProvider, useNetworkSettings } from "contexts/network-settings";

import { MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

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
  const { chain } = useChain();
  const { state } = useAppState();
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
          sessionStorage.setItem( `bepro.network:${savedNetwork.name.toLowerCase()}:${chainId}`,
                                  JSON.stringify(savedNetwork));
        return savedNetwork;
      });
  }
  
  const networkQueryKey = QueryKeys.networksByGovernor(state.currentUser?.walletAddress, chain?.chainId?.toString());
  const {
    data: myNetwork,
    isFetching,
    isSuccess,
    invalidate
  } = useReactQuery(networkQueryKey, 
                    getNetwork,
                    {
                      enabled: !!state.currentUser?.walletAddress && !!chain,
                      staleTime: MINUTE_IN_MS
                    });

  useEffect(() => {
    if (myNetwork && !isFetching && isSuccess)
      setForcedNetwork(myNetwork);
  }, [myNetwork]);

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