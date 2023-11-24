import { useEffect } from "react";

import { useRouter } from "next/router";

import { MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import { useGetChains } from "x-hooks/api/chain";
import { useSupportedChainStore } from "x-hooks/stores/supported-chain/supported-chain.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";

export default function useSupportedChain() {
  const { query } = useRouter();

  const marketplace = useMarketplace();
  const {
    chains: supportedChains,
    connectedChain,
    isGetChainsDatabase,
    updateChains,
    updateConnectedChain,
    loadChainsDatabase
  } = useSupportedChainStore();

  const { invalidate } = useReactQuery(QueryKeys.chains(),
                                       () => useGetChains().then((chains) => {
                                         updateChains(chains);
                                         return chains;
                                       }),
                                       {
                                          staleTime: MINUTE_IN_MS,
                                          enabled: isGetChainsDatabase
                                       });
  
  function updateNetworkAndChainMatch() {
    const networkChainId = marketplace?.active?.chain_id;
    const isOnANetwork = !!query?.network;
    const matchWithNetworkChain = +connectedChain?.id === +networkChainId;

    if (matchWithNetworkChain !== connectedChain?.matchWithNetworkChain && isOnANetwork)
      updateConnectedChain({
        ...connectedChain,
        matchWithNetworkChain: matchWithNetworkChain,
      });
  }

  useEffect(updateNetworkAndChainMatch, [
    query?.network,
    connectedChain?.id,
    marketplace?.active?.chain_id,
  ])

  return {
    supportedChains,
    connectedChain,
    updateConnectedChain,
    loadChainsDatabase,
    refresh: invalidate,
  };
}
