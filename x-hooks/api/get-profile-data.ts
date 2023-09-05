import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import { getBountiesListData, getPaymentsData } from "x-hooks/api/bounty";
import { useGetChains } from "x-hooks/api/chain";

/**
 * Get curators from api based on query filters
 * @param query current url query
 * @returns list of filtered bounties
 */
export default async function getProfilePageData(query: ParsedUrlQuery) {
  const { profilePage } = query || {};

  const [pageName] = (profilePage || ["profile"]);

  const wallet = query?.wallet;
  const walletFilter = filter => ({ [filter]: wallet });

  const bountyFilter = {
    "bounties": walletFilter("creator"),
    "pull-requests": walletFilter("pullRequester"),
    "proposals": walletFilter("proposer"),
    "my-network": { visible: "both", sortBy: query?.sortBy || "visible", order: query?.order || "ASC" },
  }[pageName];

  const shouldFetchBounties = 
    ["bounties", "pull-requests", "proposals"].includes(pageName) && !!wallet || pageName === "my-network";
  const shouldFetchPayments = pageName === "payments" && !!wallet && !!query?.startDate && !!query?.endDate;
  const shouldFetchChains = pageName === "payments";

  const [bounties, payments, chains] = await Promise.all([
    shouldFetchBounties ? getBountiesListData({
      ...query,
      ...bountyFilter || {},
    })
      .then(({ data }) => data)
      .catch(() => emptyPaginatedData) : null,
    shouldFetchPayments ? getPaymentsData({ ...query, groupBy: "network" })
      .then(({ data }) => data)
      .catch(() => null) : null,
    shouldFetchChains ? useGetChains() : null,
  ]);

  return {
    bounties,
    payments,
    chains,
  };
}