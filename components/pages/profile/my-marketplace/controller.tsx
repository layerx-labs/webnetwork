import {useEffect} from "react";

import MyNetworkPageView from "components/pages/profile/my-marketplace/view";

import {NetworkSettingsProvider, useNetworkSettings} from "contexts/network-settings";

import { QueryKeys } from "helpers/query-keys";

import { Network } from "interfaces/network";

import {SearchBountiesPaginated} from "types/api";
import {MyMarketplacePageProps} from "types/pages";

import {useSearchNetworks} from "x-hooks/api/marketplace";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useChain from "x-hooks/use-chain";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";

interface MyMarketplaceProps {
  bounties: SearchBountiesPaginated;
}

export function MyMarketplace({
  bounties
}: MyMarketplaceProps) {
  const { chain } = useChain();
  const { currentUser } = useUserStore();
  const marketplace = useMarketplace();
  const { setForcedNetwork } = useNetworkSettings();

  async function getNetwork() {
    const chainId = chain.chainId.toString();

    return useSearchNetworks({
      creatorAddress: currentUser.walletAddress,
      isClosed: false,
      chainId: chainId,
      name: marketplace?.active?.name
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
  
  const networkQueryKey = QueryKeys.networksByGovernor(currentUser?.walletAddress, chain?.chainId?.toString());
  const {
    data: myNetwork,
    isFetching,
    isSuccess,
    invalidate
  } = useReactQuery(networkQueryKey, 
                    getNetwork,
                    {
                      enabled: !!currentUser?.walletAddress && !!chain,
                    });

  useEffect(() => {
    if (myNetwork && !isFetching && isSuccess)
      setForcedNetwork(convertTimes(myNetwork));
  }, [myNetwork, isFetching, isSuccess]);

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