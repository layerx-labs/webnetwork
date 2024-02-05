import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import { api } from "services/api";

import { ProposalPaginatedData } from "types/api";

export function useSearchProposals (query: ParsedUrlQuery) {
  return api.get<ProposalPaginatedData>("/search/proposals", {
    params: query
  })
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData);
}