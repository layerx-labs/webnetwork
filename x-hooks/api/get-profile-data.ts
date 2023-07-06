import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import getBountiesListData from "x-hooks/api/bounty/get-bounties-list-data";
import getPaymentsData from "x-hooks/api/bounty/get-payments-data";

/**
 * Get curators from api based on query filters
 * @param query current url query
 * @returns list of filtered bounties
 */
export default async function getProfilePageData(query: ParsedUrlQuery) {
  const { profilePage } = query || {};

  const [pageName] = (profilePage || ["profile"]);

  const wallet = query?.wallet;
  const data = {
    bounties: emptyPaginatedData,
    payments: null,
  };

  if (["bounties", "pull-requests", "proposals"].includes(pageName) && wallet) {
    const key = {
      "bounties": "creator",
      "pull-requests": "pullRequester",
      "proposals": "proposer"
    }[pageName];

    data.bounties = await getBountiesListData({
      ...query,
      [key]: wallet
    })
      .then(({ data }) => data)
      .catch(() => emptyPaginatedData);
  }

  if (pageName === "payments" && wallet)
    data.payments = await getPaymentsData({ ...query, groupBy: "network" })
      .then(({ data }) => data)
      .catch(() => null);

  return data;
}