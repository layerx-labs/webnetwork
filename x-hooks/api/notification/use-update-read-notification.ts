import {api} from "services/api";

export async function useUpdateReadNotification({id, read,}: { id: string; read: boolean; }) {
  return api
    .put(`/notification/${id}/mark-read`, null, {params: {id, read,},})
    .then(({ data }) => data);
}
