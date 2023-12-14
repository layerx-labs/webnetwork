import {ParsedUrlQuery} from "querystring";

import {ExplorePageProps} from "types/pages";

import useGetOverviewConvertedAmounts from "x-hooks/api/overview/use-get-overview-converted-amounts";
import {getBountiesListData} from "x-hooks/api/task";
import {useGetTotalUsers} from "x-hooks/api/user";

/**
 * Get explore page data from api based on the current url query
 * @param query current url query
 * @returns object with retrieved data
 */
export default async function getExplorePageData(query: ParsedUrlQuery): Promise<ExplorePageProps> {
  const [ convertedAmounts, bounties, protocolMembers ] =
    await Promise.all([
      useGetOverviewConvertedAmounts(query),
      getBountiesListData(query)
        .then(({ data }) => data)
        .catch(() => ({ count: 0, rows: [], currentPage: 1, pages: 1, totalBounties: 0 })),
      useGetTotalUsers()
    ]);

  return {
    totalOnTasks: convertedAmounts?.totalOnTasks,
    bounties,
    protocolMembers
  };
}