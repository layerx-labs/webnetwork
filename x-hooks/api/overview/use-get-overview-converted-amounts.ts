import { ParsedUrlQuery } from "querystring";

import { api } from "services/api";

import { ConvertedAmountsOverview } from "types/api";

export default async function useGetOverviewConvertedAmounts(query: ParsedUrlQuery) {
  return api.get<ConvertedAmountsOverview>("/overview/converted-amounts", {
    params: query
  }).then(({ data }) => data)
    .catch(() => ({ totalOnTasks: 0 }));
}