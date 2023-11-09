import { useEffect } from "react";

import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { UrlObject } from "url";

import { useAppState } from "contexts/app-state";
import { changeCurrentUserisCouncil, changeCurrentUserisGovernor } from "contexts/reducers/change-current-user";

import { FIVE_MINUTES_IN_MS, MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import { ProfilePages } from "interfaces/utils";

import { useSearchNetworks } from "x-hooks/api/network";
import { useMarketplaceStore } from "x-hooks/stores/marketplace/use-marketplace.store";
import useReactQuery from "x-hooks/use-react-query";

import getNetworkOverviewData from "./api/get-overview-data";

export default function useMarketplace(marketplaceName?: string, chainName?: string) {
  const { query, push } = useRouter();

  const marketplace = marketplaceName || query?.network?.toString();
  const chain = chainName || query?.chain?.toString();

  const { state, dispatch } = useAppState();
  const { data, clear, update } = useMarketplaceStore();
  const { data: searchData, isError, isFetching, isStale, invalidate } = 
    useReactQuery(QueryKeys.networksByName(marketplace), () => useSearchNetworks({
      name: marketplace,
      isNeedCountsAndTokensLocked: true,
      sortBy: "id",
      order: "ASC"
    }), {
      staleTime: FIVE_MINUTES_IN_MS,
      enabled: !!marketplace
    });

  function getURLWithNetwork(href: string, _query = undefined): UrlObject {
    const _network = _query?.network ? String(_query?.network)?.toLowerCase()?.replaceAll(" ", "-") : undefined;
    const cleanHref =  href.replace("/[network]/[chain]", "");

    return {
      pathname: `/[network]/[chain]/${cleanHref}`.replace("//", "/"),
      query: {
        ..._query,
        chain: _query?.chain || query?.chain || data?.active?.chain?.chainShortName,
        network: _network ||
          query?.network ||
          data?.active?.name
      }
    };
  }

  function goToProfilePage(profilePage: ProfilePages, params = undefined) {
    const queryNetwork = query?.network || "";
    const queryChain = query?.chain || "";

    const path = profilePage === "profile" ? "profile" : `profile/${profilePage}`;

    if (queryNetwork !== "")
      return push(getURLWithNetwork(`/profile/[[...profilePage]]`, {
        ...query,
        ...params
      }), `/${queryNetwork}/${queryChain}/${path}`);

    return push({
      pathname: "/profile/[[...profilePage]]",
      query: {
        ...query,
        ...params
      }
    }, `/${path}`);
  }

  function getTotalNetworkToken() {
    const network = query?.network?.toString();
    const chain = query?.chain?.toString();
    return useReactQuery( QueryKeys.totalNetworkToken(chain, network), 
                          () => getNetworkOverviewData(query)
                            .then(overview => BigNumber(overview?.curators?.tokensLocked || 0)),
                          {
                            enabled: !!network && !!chain,
                            staleTime: MINUTE_IN_MS
                          });
  }

  useEffect(() => {
    if (isFetching || isError || isStale) return;
    const marketplaces = !!marketplace && !chain ? 
      searchData.rows : searchData.rows.filter(network => lowerCaseCompare(network.chain?.chainShortName, chain));
    if (!searchData.count || !marketplaces?.length) {
      clear();
      if (!!marketplace || !!chain) push("/marketplaces");
      return;
    }
    const active = marketplaces.at(0);
    const lastVisited = marketplace;
    const availableChains = searchData.rows.map(network => network.chain);
    const transactionalTokens = active.tokens.filter(token => token.network_tokens.isTransactional);
    const rewardTokens = active.tokens.filter(token => token.network_tokens.isReward);
    update({
      active,
      lastVisited,
      availableChains,
      transactionalTokens,
      rewardTokens
    });
    if (state.currentUser?.walletAddress) {
      const userAddress = state.currentUser.walletAddress;
      const isCurator = !!active.councilMembers?.find(address => lowerCaseCompare(address, userAddress));
      const isGovernor = lowerCaseCompare(active.creatorAddress, userAddress);

      dispatch(changeCurrentUserisCouncil(isCurator));
      dispatch(changeCurrentUserisGovernor(isGovernor));
    }
  }, [searchData, isError, isFetching, isStale]);

  return {
    ...data,
    refresh: invalidate,
    getURLWithNetwork,
    goToProfilePage,
    getTotalNetworkToken,
  };
}