import { useEffect } from "react";

import { useRouter } from "next/router";

import { useAppState } from "contexts/app-state";

import { MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import useReactQuery from "x-hooks/use-react-query";

import { useGetChains } from "./api/chain";
import { useSupportedChainStore } from "./stores/supported-chain/supported-chain.store";

export default function useSupportedChain() {
  const { query } = useRouter();

  const { state } = useAppState();
  const {
    chains: supportedChains,
    connectedChain,
    isGetChainsDatabase,
    updateChains,
    updateConnectedChain,
    loadChainsDatabase
  } = useSupportedChainStore();

  const { invalidate } = useReactQuery(QueryKeys.chains(),
                                       () =>
      useGetChains().then((chains) => {
        updateChains(chains);
        return chains;
      }),
                                       {
      staleTime: MINUTE_IN_MS,
      enabled: isGetChainsDatabase
                                       });
  
  function updateNetworkAndChainMatch() {
    const networkChainId = state?.Service?.network?.active?.chain_id;
    const isOnANetwork = !!query?.network;
    const matchWithNetworkChain = +connectedChain?.id === +networkChainId

    if (matchWithNetworkChain !== connectedChain?.matchWithNetworkChain && isOnANetwork)
      updateConnectedChain({
        ...connectedChain,
        matchWithNetworkChain: matchWithNetworkChain,
      });
  }

  useEffect(updateNetworkAndChainMatch, [
    query?.network,
    query?.chain,
    connectedChain?.id,
    state.Service?.network?.active?.chain_id,
  ])

  return {
    supportedChains,
    connectedChain,
    updateConnectedChain,
    loadChainsDatabase,
    refresh: invalidate,
  };
}
