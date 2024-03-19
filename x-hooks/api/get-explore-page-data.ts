import {ParsedUrlQuery} from "querystring";

import {ExplorePageProps} from "types/pages";

import getConvertedAmounts from "../../server/common/overview/converted-amounts";
import getBounties from "../../server/common/search/tasks";
import getTotalUsers from "../../server/common/search/total";

/**
 * Get explore page data from api based on the current url query
 * @param query current url query
 * @returns object with retrieved data
 */
export default async function getExplorePageData(query: ParsedUrlQuery): Promise<ExplorePageProps> {

  const [ convertedAmounts, bounties, protocolMembers ] =
    await Promise.all([
      getConvertedAmounts(query).catch(_ => ({totalOnTasks: 0})),
      getBounties(query)
        .then((data) => data as any)
        .catch(() => ({ count: 0, rows: [], currentPage: 1, pages: 1, totalBounties: 0 })),
      getTotalUsers().catch(_ => 0)
    ]);

  return {
    totalOnTasks: convertedAmounts?.totalOnTasks,
    bounties,
    protocolMembers
  };
}