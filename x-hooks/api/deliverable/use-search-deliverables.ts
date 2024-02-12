import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import { api } from "services/api";

import { DeliverablePaginatedData } from "types/api";

export function useSearchDeliverables (query: ParsedUrlQuery) {
  return api.get<DeliverablePaginatedData>("/search/deliverables", {
    params: query
  })
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData);
}