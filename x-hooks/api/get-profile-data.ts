import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import getBountiesListData from "x-hooks/api/bounty/get-bounties-list-data";
import getPaymentsData from "x-hooks/api/bounty/get-payments-data";
import getChainsData from "x-hooks/api/get-chains-data";

/**
 * Get curators from api based on query filters
 * @param query current url query
 * @returns list of filtered bounties
 */
export default async function getProfilePageData(query: ParsedUrlQuery) {
  const { profilePage } = query || {};

  const [pageName] = (profilePage || ["profile"]);

  const wallet = query?.wallet;
  const bountyFilter = {
    "bounties": "creator",
    "pull-requests": "pullRequester",
    "proposals": "proposer"
  }[pageName];

  const shouldFetchBounties = ["bounties", "pull-requests", "proposals", "my-network"].includes(pageName) && !!wallet;
  const shouldFetchPayments = pageName === "payments" && !!wallet;
  const shouldFetchChains = pageName === "payments";

  const [bounties, payments, chains] = await Promise.all([
    shouldFetchBounties ? getBountiesListData({
      ...query,
      [bountyFilter]: wallet
    })
      .then(({ data }) => data)
      .catch(() => emptyPaginatedData) : null,
    shouldFetchPayments ? getPaymentsData({ ...query, groupBy: "network" })
      .then(({ data }) => data)
      .catch(() => null) : null,
    shouldFetchChains ? getChainsData({}) : null,
  ]);

  return {
    bounties,
    payments,
    chains,
  };
}