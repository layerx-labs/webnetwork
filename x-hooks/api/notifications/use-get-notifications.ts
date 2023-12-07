import { ParsedUrlQuery } from "querystring";

import { emptyPaginatedData } from "helpers/api";

import { SearchNotificationsPaginated } from "interfaces/notifications";

import { api } from "services/api";


/**
 * Get Notifications from api based on address
 * @param address string
 * @returns list of notifications
 */
export async function useGetNotifications(address: string, query: ParsedUrlQuery ) {
  return api
    .get<SearchNotificationsPaginated>(`/notifications/${address}`, {
        params: query
    })
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData as SearchNotificationsPaginated);
}
