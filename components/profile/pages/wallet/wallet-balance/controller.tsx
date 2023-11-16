import {  useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import WalletBalanceView from "components/profile/pages/wallet/wallet-balance/view";
import { TokenBalanceType } from "components/profile/token-balance";
import TokenIcon from "components/token-icon";

import { useAppState } from "contexts/app-state";

import { MINUTE_IN_MS } from "helpers/constants";

import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

import DAO from "services/dao-service";

import useCoingeckoPrice from "x-hooks/use-coingecko-price";
import useReactQuery from "x-hooks/use-react-query";
import useSupportedChain from "x-hooks/use-supported-chain";

interface WalletBalanceProps {
  chains: SupportedChainData[];
  tokens: Token[];
}

export default function WalletBalance({
  chains,
  tokens
}: WalletBalanceProps) {
  const [search, setSearch] = useState("");
  const [searchState, setSearchState] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [hasNoConvertedToken, setHasNoConvertedToken] = useState(false);
  const [tokensWithBalance, setTokensWithBalance] = useState(tokens.map(toTokenWithBalance));

  const debouncedSearchUpdater = useDebouncedCallback((value) => setSearch(value), 500);

  const { state } = useAppState();
  const { query, push, pathname, asPath } = useRouter();
  const { supportedChains } = useSupportedChain();

  const {
    data: prices,
    isLoading: isLoadingPrices,
    isSuccess: isSucessPrices,
  } = useCoingeckoPrice(tokens.map(({ address, chain_id }) => ({ address, chainId: chain_id })));

  const defaultFiat = state?.Settings?.currency?.defaultFiat?.toLowerCase();

  function toTokenWithBalance(token) {
    return {
      ...token,
      balance: token?.balance || BigNumber(0),
      icon: token?.icon || <TokenIcon src={null} />
    };
  }

  const getAddress = (token: string | Token) =>
    typeof token === "string" ? token : token?.address;

  async function processToken(token: Token, service: DAO) {
    const balance = await service
      .getTokenBalance(getAddress(token), state?.currentUser?.walletAddress)
      .catch(() => BigNumber(0));
    
    return {
      ...token,
      balance,
      icon: <TokenIcon src={token?.icon as string} />,
    };
  }

  function updateSearch() {
    setSearch(searchState);
  }

  function handleSearch(event) {
    if (event.key !== "Enter") return;

    updateSearch();
  }

  function handleClearSearch(): void {
    setSearchState("");
    setSearch("");
  }

  function handleSearchChange(e) {
    setSearchState(e.target.value);
    debouncedSearchUpdater(e.target.value);
  }

  function handleSearchFilter(name = "", symbol = "") {
    return name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
      symbol.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  }

  function loadDaoService(chainRpc: string) {
    const daoService: DAO = new DAO({
      web3Host: chainRpc,
      skipWindowAssignment: true,
    })
  
    daoService.start()

    return daoService
  }

  function loadTokensBalance(): Promise<TokenBalanceType[]> {
    const currentChains = chains.map(({ chainRpc, chainId }) => ({
      web3Connection: loadDaoService(chainRpc),
      chainId 
    }))

    return Promise.all(tokens?.map(async (token) => {
      const chain = currentChains.find(({ chainId }) => chainId === token.chain_id);
      const tokenData = await processToken(token, chain.web3Connection);
      return {
        ...tokenData,
        networks: token?.networks,
        chain_id: token.chain_id,
      };
    }));
  }

  const { data: tokensData, isLoading, isSuccess } = 
    useReactQuery(["tokens-balance", state.currentUser?.walletAddress, query?.networkChain?.toString()],
                  loadTokensBalance,
                  {
                    enabled: !!state.currentUser?.walletAddress && !!supportedChains,
                    staleTime: MINUTE_IN_MS
                  });
  
  useEffect(() => {
    if (!isLoading && isSuccess) {
      const filteredTokens = tokensData
        .map(token => toTokenWithBalance(token))
      setTokensWithBalance(filteredTokens);

      if(!isLoadingPrices && isSucessPrices){
        const tokensPrices = tokens.map((token, key) => ({
          ...token,
          price: prices[key][defaultFiat]
        }))

        const filteredTokensPrices = filteredTokens.map(t => ({
          ...t,
          price: tokensPrices.find(({ id }) => id === t.id)?.price
        }))

        const hasNoConverted = filteredTokensPrices.some(token => !token?.price);

        setHasNoConvertedToken(hasNoConverted);
        const total = hasNoConverted ? 
          filteredTokens.reduce((acc, token) => BigNumber(token.balance).plus(acc), BigNumber(0)) :
          filteredTokensPrices.reduce((acc, token) => 
            BigNumber(token.balance).multipliedBy(token.price).plus(acc), BigNumber(0));
        setTotalAmount(total.toFixed());

      } else {
        setHasNoConvertedToken(true)
        const totalNoConverted = filteredTokens.reduce((acc, token) => BigNumber(token.balance).plus(acc), BigNumber(0))
        setTotalAmount(totalNoConverted.toFixed())
      }
    }
  }, [tokensData, prices, query?.networkName, query?.networkChain]);

  useEffect(() => {
    if(!query?.networkName && query?.network){
      const newQuery = {
        ...query,
        networkName: query?.network
      };
      push({ pathname: pathname, query: newQuery }, asPath);
    }
  }, [query?.network]);

  return (
    <WalletBalanceView
      totalAmount={totalAmount}
      hasNoConvertedToken={hasNoConvertedToken}
      defaultFiat={state?.Settings?.currency?.defaultFiat}
      tokens={tokensWithBalance.filter(({ name, symbol }) =>
        handleSearchFilter(name, symbol))}
      searchString={searchState}
      onSearchClick={updateSearch}
      onSearchInputChange={handleSearchChange}
      onEnterPressed={handleSearch}
      onClearSearch={handleClearSearch}
      chains={chains}
    />
  );
}
