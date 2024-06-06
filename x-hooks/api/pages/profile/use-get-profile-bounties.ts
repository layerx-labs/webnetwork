import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import { SearchBountiesPaginated } from "types/api";

import { getBountiesListData } from "x-hooks/api/task";

type UserType = "proposer" | "creator" | "deliverabler" | "governor";

export async function useGetProfileBounties(query: ParsedUrlQuery, type: UserType ) {
  const filter = type === "governor" ? { 
    visible: "both",
    sortBy: query?.sortBy || "visible",
    order: query?.order || "ASC"
  } : {
    [type]: query?.wallet
  };

  if(query?.networkChain) 
    query = {
      ...query,
      chain: query?.networkChain
    }

  return getBountiesListData({
    ...query,
    ...filter
  })
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData as SearchBountiesPaginated);
}