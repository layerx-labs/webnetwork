import {emptyPaginatedData} from "../../../helpers/api";
import {api} from "../../../services/api";
import {SearchBountiesPaginated} from "../../../types/api";


export async function getSubscriptionsList() {

  return api.get(`/task-subscriptions`)
    .then(({data}) => data)
    .catch(() => emptyPaginatedData as SearchBountiesPaginated)
}