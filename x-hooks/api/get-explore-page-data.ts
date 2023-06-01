import { ParsedUrlQuery } from "querystring";

import { api } from "services/api";

import { ExplorePageProps } from "types/pages";

/**
 * Get explore page data from api based on the current url query
 * @param query current url query
 * @returns object with retrieved data
 */
export default async function getExplorePageData(query: ParsedUrlQuery): Promise<ExplorePageProps> {
  const { network } = query;

  const { data } = await api.get("/search/networks/total", { 
    params: {
      name: network
    }
  });

  return {
    numberOfNetworks: data,
    numberOfBounties: 0
  };
}