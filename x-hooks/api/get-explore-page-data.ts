import {ParsedUrlQuery} from "querystring";

import {api} from "services/api";

import {ExplorePageProps} from "types/pages";

import {useSearchActiveNetworks} from "x-hooks/api/marketplace";
import {getBountiesListData} from "x-hooks/api/task";

/**
 * Get explore page data from api based on the current url query
 * @param query current url query
 * @returns object with retrieved data
 */
export default async function getExplorePageData(query: ParsedUrlQuery): Promise<ExplorePageProps> {
  const { network } = query;

  const [ numberOfNetworks, bounties, recentBounties, recentFunding, activeNetworks ] = await Promise.all([
    api.get("/search/marketplaces/total", { params: { name: network } })
      .then(({ data }) => data)
      .catch(() => 0),
    getBountiesListData(query)
      .then(({ data }) => data)
      .catch(() => ({ count: 0, rows: [], currentPage: 1, pages: 1, totalBounties: 0 })),
    getBountiesListData({ count: "3", state: "open", network })
      .then(({ data }) => data.rows)
      .catch(() => []),
    getBountiesListData({ count: "3", state: "funding", network })
      .then(({ data }) => data.rows)
      .catch(() => []),
    useSearchActiveNetworks({
      isClosed: false,
      isRegistered: true,
      name: query?.network?.toString()
    })
      .then(({ rows }) => rows)
  ]);

  return {
    numberOfNetworks,
    bounties,
    recentBounties,
    recentFunding,
    activeNetworks,
  };
}