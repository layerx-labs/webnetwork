import { emptyPaginatedData } from "helpers/api";

import { SearchActiveNetworkParams } from "interfaces/api";

import { api } from "services/api";

import { ActiveNetworksPaginated } from "types/api";

export async function useSearchActiveNetworks({
  page = 1,
  quantity = 3,
  name = "",
  creatorAddress = "",
  isClosed
}: SearchActiveNetworkParams) {
  const params = new URLSearchParams({
    quantity: quantity.toString(),
    page: page.toString(),
    name,
    creatorAddress,
    ... (isClosed !== undefined && { isClosed: isClosed.toString() } || {}),
  }).toString();

  return api
    .get<ActiveNetworksPaginated>(`/search/networks/active/?${params}`)
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData as ActiveNetworksPaginated);
}