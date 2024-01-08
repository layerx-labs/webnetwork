import {useEffect} from "react";

import MyNetworkPageView from "components/pages/profile/my-marketplace/view";

import {NetworkSettingsProvider, useNetworkSettings} from "contexts/network-settings";

import {MINUTE_IN_MS} from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import { Network } from "interfaces/network";

import {SearchBountiesPaginated} from "types/api";
import {MyMarketplacePageProps} from "types/pages";

import {useSearchNetworks} from "x-hooks/api/marketplace";
import {useMarketplaceStore} from "x-hooks/stores/marketplace/use-marketplace.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import {useDao} from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";
import useSupportedChain from "x-hooks/use-supported-chain";

interface MyMarketplaceProps {
  bounties: SearchBountiesPaginated;
}

export function MyMarketplace({
  bounties
}: MyMarketplaceProps) {
  const { start } = useDao();
  const { currentUser } = useUserStore();
  const marketplace = useMarketplace();
  const { connectedChain } = useSupportedChain();
  const { setForcedNetwork } = useNetworkSettings();
  const { update: updateMarketplaceStore } = useMarketplaceStore();

  const chainId = connectedChain?.id?.toString();

  async function getNetwork() {
    return useSearchNetworks({
      creatorAddress: currentUser.walletAddress,
      isClosed: false,
      chainId: chainId,
      name: marketplace?.active?.name,
      isNeedCountsAndTokensLocked: true
    })
      .then(({ count , rows }) => {
        const savedNetwork = count > 0 ? rows[0] : undefined;

        if (savedNetwork)
          sessionStorage.setItem( `bepro.network:${savedNetwork.name.toLowerCase()}:${chainId}`,
                                  JSON.stringify(savedNetwork));
        return savedNetwork;
      });
  }

  function convertTimes (network: Network) {
    return {
      ...network,
      draftTime: +(network?.draftTime || 0) / 1000,
      disputableTime: +(network?.disputableTime || 0) / 1000,
      cancelableTime: +(network?.cancelableTime || 0) / 1000,
    }
  }
  
  const networkQueryKey = QueryKeys.networksByGovernor(currentUser?.walletAddress, chainId);
  const {
    data: myNetwork,
    isFetching,
    isSuccess,
    invalidate,
    isLoading
  } = useReactQuery(networkQueryKey, 
                    getNetwork,
                    {
                      enabled: !!currentUser?.walletAddress && !!chainId,
                      staleTime: 10 * MINUTE_IN_MS
                    });

  useEffect(() => {
    if (myNetwork && !isFetching && isSuccess) {
      setForcedNetwork(convertTimes(myNetwork));
      updateMarketplaceStore({
        active: convertTimes(myNetwork)
      });
      start({
        chainId: +myNetwork.chain_id,
        networkAddress: myNetwork.networkAddress
      }).catch(() => {});
    }
  }, [myNetwork, isFetching, isSuccess]);

  return(
    <MyNetworkPageView
      isLoading={isLoading}
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