import { ParsedUrlQuery } from "querystring";

import { api } from "services/api";

import { ExplorePageProps } from "types/pages";

import getBountiesListData from "x-hooks/api/get-bounties-list-data";

/**
 * Get explore page data from api based on the current url query
 * @param query current url query
 * @returns object with retrieved data
 */
export default async function getExplorePageData(query: ParsedUrlQuery): Promise<ExplorePageProps> {
  const { network } = query;

  const [ numberOfNetworks, recentBounties, recentFunding ] = await Promise.all([
    api.get("/search/networks/total", { params: { name: network } })
      .then(({ data }) => data)
      .catch(() => 0),
    getBountiesListData({ count: "3", state: "open" })
      .then(({ data }) => data.rows)
      .catch(() => []),
    getBountiesListData({ count: "3", state: "funding" })
      .then(({ data }) => data.rows)
      .catch(() => []),
  ]);

  return {
    numberOfNetworks,
    numberOfBounties: 0,
    recentBounties,
    recentFunding,
  };
}