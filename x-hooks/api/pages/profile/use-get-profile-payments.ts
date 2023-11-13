import { ParsedUrlQuery } from "querystring";

import { useGetChains } from "x-hooks/api/chain";
import { getPaymentsData } from "x-hooks/api/task";

export async function useGetProfilePayments(query: ParsedUrlQuery) {
  const [payments, chains] = await Promise.all([
    getPaymentsData({ ...query, groupBy: "network" })
      .then(({ data }) => data)
      .catch(() => null),
    useGetChains(),
  ]);

  return {
    payments,
    chains
  }
}