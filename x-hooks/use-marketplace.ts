import { useEffect } from "react";

import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { UrlObject } from "url";

import { FIVE_MINUTES_IN_MS, MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import { ProfilePages } from "interfaces/utils";

import { useSearchNetworks } from "x-hooks/api/marketplace";
import { useMarketplaceStore } from "x-hooks/stores/marketplace/use-marketplace.store";
import useReactQuery from "x-hooks/use-react-query";

import getNetworkOverviewData from "./api/get-overview-data";
import { useUserStore } from "./stores/user/user.store";

export default function useMarketplace(marketplaceName?: string, chainName?: string) {
  const { query, push } = useRouter();

  const marketplace = marketplaceName || query?.network?.toString();
  const chain = chainName;

  const { data, clear, update, updateParamsOfActive } = useMarketplaceStore();
  const { currentUser, updateCurrentUser} = useUserStore();
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
    const cleanHref =  href.replace("/[network]", "");
    return {
      pathname: `/[network]/${cleanHref}`.replace("//", "/"),
      query: {
        ..._query,
        network: _network || query?.network || data?.active?.name
      }
    };
  }

  function goToProfilePage(profilePage: ProfilePages, params = undefined) {
    const path = profilePage === "profile" ? "profile" : `profile/${profilePage}`;
    return push({
      pathname: "/profile/[[...profilePage]]",
      query: {
        ...query,
        ...params
      }
    }, `/${path}`);
  }

  function getTotalNetworkToken() {
    const network = data?.active?.name;
    const chain = data?.active?.chain_id;
    return useReactQuery( QueryKeys.totalNetworkToken(chain, network), 
                          () => getNetworkOverviewData(query)
                            .then(overview => BigNumber(overview?.curators?.tokensLocked || 0)),
                          {
                            enabled: !!network && !!chain,
                            staleTime: MINUTE_IN_MS
                          });
  }

  useEffect(() => {
    if (isFetching || isError || isStale)
      return;
    if (!marketplace && !chain) {
      clear();
      return;
    }
    const marketplaces = !!marketplace && !chain ? 
      searchData.rows : searchData.rows.filter(network => lowerCaseCompare(network.chain?.chainShortName, chain));
    if (!searchData.count || !marketplaces?.length) {
      clear();
      if (marketplace)
        push("/marketplaces");
      return;
    }
    const active = marketplaces.at(0);
    if (lowerCaseCompare(active?.name, data?.active?.name) &&
      lowerCaseCompare(active?.networkAddress, data?.active?.networkAddress))
      return;
    const lastVisited = marketplace;
    const availableChains = searchData.rows.map(network => network.chain);
    const transactionalTokens = active.tokens.filter(token => token.network_tokens.isTransactional);
    const rewardTokens = active.tokens.filter(token => token.network_tokens.isReward);
    update({
      active: {
        ...(data?.active || active),
        name: active?.name,
        description: active?.description,
        colors: active?.colors,
        logoIcon: active?.logoIcon,
        fullLogo: active?.fullLogo,
      },
      lastVisited,
      availableChains,
      transactionalTokens,
      rewardTokens
    });
    if (currentUser?.walletAddress) {
      const userAddress = currentUser.walletAddress;
      const isCurator = !!active.councilMembers?.find(address => lowerCaseCompare(address, userAddress));
      const isGovernor = lowerCaseCompare(active.creatorAddress, userAddress);
      updateCurrentUser({
        isCouncil: isCurator,
        isGovernor: isGovernor
      })
    }
  }, [searchData, isError, isFetching, isStale]);

  return {
    ...data,
    refresh: invalidate,
    updateParamsOfActive,
    getURLWithNetwork,
    goToProfilePage,
    getTotalNetworkToken,
  };
}