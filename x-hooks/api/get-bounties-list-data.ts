import { ParsedUrlQuery } from "querystring";

import { api } from "services/api";

/**
 * Get bounties from api based on query filters
 * @param query current url query
 * @returns list of filtered bounties
 */
export default async function getBountiesListData(query: ParsedUrlQuery) {
  return api.get("/search/issues", {
    params: query
  });
}