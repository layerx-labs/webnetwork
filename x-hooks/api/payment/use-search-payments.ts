import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import { api } from "services/api";

import { PaymentPaginatedData } from "types/api";

export function useSearchPayments (query: ParsedUrlQuery) {
  return api.get<PaymentPaginatedData>("/search/payments", {
    params: query
  })
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData);
}