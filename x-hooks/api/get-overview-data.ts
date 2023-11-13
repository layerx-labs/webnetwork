import { ParsedUrlQuery } from "querystring";

import { emptyNetworkOverview } from "helpers/api";

import { api } from "services/api";

import { NetworkOverviewData } from "types/api";

/**
 * Get network overview base on network name or address and chain name or id
 * @param query current url query
 * @returns overview data
 */
export default async function getNetworkOverviewData(query: ParsedUrlQuery) {
  return api.get<NetworkOverviewData>("/overview/marketplace", {
    params: query
  }).then(({ data }) => data)
    .catch(() => emptyNetworkOverview);
}