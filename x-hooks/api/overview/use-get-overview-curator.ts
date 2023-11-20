import { ParsedUrlQuery } from "querystring";

import {emptyPaginatedData} from "helpers/api";

import { api } from "services/api";

import {PaginatedCuratorOverview} from "types/api";

export default async function useGetCuratorOverview(query: ParsedUrlQuery) {
  return api.get<PaginatedCuratorOverview>("/overview/curator", {
    params: query
  }).then(({ data }) => data)
    .catch(() => emptyPaginatedData as PaginatedCuratorOverview);
}