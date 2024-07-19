import { ParsedUrlQuery } from "querystring";

import { api } from "services/api";

import { SearchBountiesPaginated } from "types/api";

export async function getTasksWon(query: ParsedUrlQuery) {
  return api.get<SearchBountiesPaginated>("/search/tasks/won", {
    params: query
  });
}