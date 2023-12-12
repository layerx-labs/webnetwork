import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { SupportedChainData } from "interfaces/supported-chain-data";

import useSupportedChain from "./use-supported-chain";

interface FindSupportedChainProps {
  chainId?: number;
  chainShortName?: string;
}

export default function useChain() {
  const { query } = useRouter();
  
  const [chain, setChain] = useState<SupportedChainData>();

  const { supportedChains } = useSupportedChain();

  function findSupportedChain({ chainId, chainShortName } : FindSupportedChainProps) {
    return supportedChains?.find(e => +e.chainId === +chainId ||
      e.chainShortName?.toLowerCase() === chainShortName?.toLowerCase());
  }

  function getChainFromUrl() {
    if (!supportedChains?.length || !query.chain) return undefined;
    
    return findSupportedChain({ chainShortName: query.chain.toString() });
  }

  useEffect(() => {
    setChain(getChainFromUrl());
  }, [query?.chain, supportedChains]);

  return {
    chain,
    getChainFromUrl,
    findSupportedChain
  }
}