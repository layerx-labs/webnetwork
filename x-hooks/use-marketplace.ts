import {useEffect} from "react";

import { useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import {useRouter} from "next/router";
import {UrlObject} from "url";

import {FIVE_MINUTES_IN_MS, MINUTE_IN_MS} from "helpers/constants";
import {QueryKeys} from "helpers/query-keys";
import {lowerCaseCompare} from "helpers/string";

import {Network} from "interfaces/network";
import {ProfilePages} from "interfaces/utils";

import { URL } from "types/components";

import getNetworkOverviewData from "x-hooks/api/get-overview-data";
import {useSearchNetworks} from "x-hooks/api/marketplace";
import {useMarketplaceStore} from "x-hooks/stores/marketplace/use-marketplace.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";

export default function useMarketplace(marketplaceName?: string, chainName?: string) {
  const { query, asPath, push } = useRouter();
  const queryClient = useQueryClient();

  const marketplace = marketplaceName || query?.network?.toString();
  const chain = chainName;

  const { data, clear, update, updateParamsOfActive } = useMarketplaceStore();
  const { currentUser, updateCurrentUser} = useUserStore();
  const { data: searchData, isError, isFetching, isStale } =
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

  function getDashboardPageUrl(profilePage: ProfilePages, params = undefined): URL {
    const asPath = profilePage === "dashboard" ? "dashboard" : `dashboard/${profilePage}`;
    const href = {
      pathname: "/dashboard/[[...dashboardPage]]",
      query: {
        ...query,
        ...params
      }
    };

    return { href, asPath: `/${asPath}` };
  }

  function goToProfilePage(profilePage: ProfilePages, params = undefined) {
    const { href, asPath} = getDashboardPageUrl(profilePage, params);
    return push(href, asPath);
  }

  function getTotalNetworkToken(networkName?: string, chainShortName?: string) {
    const network = networkName || data?.active?.name;
    const chain = chainShortName || data?.active?.chain_id;

    return useReactQuery( QueryKeys.totalNetworkToken(chain, network), 
                          () => getNetworkOverviewData({
                            network,
                            chain: data?.active?.chain?.chainShortName,
                          })
                            .then(overview => BigNumber(overview?.curators?.tokensLocked || 0)),
                          {
                            enabled: !!network && !!chain,
                            staleTime: MINUTE_IN_MS
                          });
  }

  function updateCuratorAndGovernor (network: Network) {
    if (currentUser?.walletAddress) {
      const userAddress = currentUser.walletAddress;
      const isCouncil = !!network?.councilMembers?.find(address => lowerCaseCompare(address, userAddress));
      const isGovernor = lowerCaseCompare(network?.creatorAddress, userAddress);
      updateCurrentUser({
        isCouncil,
        isGovernor
      })
    }
  }

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["networks"] });
  }

  function _updateParamsOfActive (network: Network) {
    updateCuratorAndGovernor(network);
    updateParamsOfActive(network);
  }

  useEffect(() => {
    if (isFetching || isError || isStale || asPath?.includes("dashboard/my-marketplace"))
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
    updateCuratorAndGovernor(active);
  }, [searchData, isError, isFetching, isStale]);

  return {
    ...data,
    refresh,
    clear,
    updateParamsOfActive: _updateParamsOfActive,
    getURLWithNetwork,
    getDashboardPageUrl,
    goToProfilePage,
    getTotalNetworkToken,
  };
}