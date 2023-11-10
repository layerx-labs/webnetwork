import {useEffect} from "react";

import MyNetworkPageView from "components/pages/profile/my-marketplace/view";

import {useAppState} from "contexts/app-state";
import {NetworkSettingsProvider, useNetworkSettings} from "contexts/network-settings";

import {MINUTE_IN_MS} from "helpers/constants";

import {SearchBountiesPaginated} from "types/api";
import {MyMarketplacePageProps} from "types/pages";

import {useSearchNetworks} from "x-hooks/api/marketplace";
import useChain from "x-hooks/use-chain";
import useReactQuery from "x-hooks/use-react-query";

interface MyMarketplaceProps {
  bounties: SearchBountiesPaginated;
}

export function MyMarketplace({
  bounties
}: MyMarketplaceProps) {
  const { chain } = useChain();
  const { state } = useAppState();
  const { setForcedNetwork } = useNetworkSettings();

  async function getNetwork() {
    const chainId = chain.chainId.toString();

    return useSearchNetworks({
      creatorAddress: state.currentUser.walletAddress,
      isClosed: false,
      chainId: chainId,
      name: state.Service?.network?.active?.name
    })
      .then(({ count , rows }) => {
        const savedNetwork = count > 0 ? rows[0] : undefined;

        if (savedNetwork)
          sessionStorage.setItem( `bepro.network:${savedNetwork.name.toLowerCase()}:${chainId}`,
                                  JSON.stringify(savedNetwork));
        return savedNetwork;
      });
  }
  
  const {
    data: myNetwork,
    isFetching,
    isSuccess,
    invalidate
  } = useReactQuery(["network", state.Service?.network?.active?.name, state.currentUser?.walletAddress, chain?.chainId?.toString()],
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

export default function MyMarketplacePage({
  bounties
}: MyMarketplacePageProps) {
  return(
    <NetworkSettingsProvider>
      <MyMarketplace bounties={bounties} />
    </NetworkSettingsProvider>
  );
}