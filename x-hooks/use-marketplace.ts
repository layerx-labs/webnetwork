import { useEffect } from "react";

import { useRouter } from "next/router";
import { UrlObject } from "url";

import { FIVE_MINUTES_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import { ProfilePages } from "interfaces/utils";

import { useSearchNetworks } from "x-hooks/api/network";
import { useMarketplaceStore } from "x-hooks/stores/marketplace/use-marketplace.store";
import useReactQuery from "x-hooks/use-react-query";

export default function useMarketplace(marketplaceName?: string, chainName?: string) {
  const { query, push } = useRouter();

  const marketplace = marketplaceName || query?.network?.toString();
  const chain = chainName || query?.chain?.toString();

  const { data, clear, update } = useMarketplaceStore();
  const { data: searchData, isError, isFetching, isStale, invalidate } = 
    useReactQuery(QueryKeys.networksByName(marketplace), () => useSearchNetworks({
      name: marketplace,
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

  useEffect(() => {
    if (isFetching || isError || isStale) return;
    const active = searchData.rows.find(network => lowerCaseCompare(network.chain?.chainShortName, chain));
    if (!searchData.count || !active) {
      clear();
      push("/marketplaces");
    }
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
    })
  }, [searchData, isError, isFetching, isStale]);

  return {
    ...data,
    refresh: invalidate,
    getURLWithNetwork,
    goToProfilePage,
  };
}