import {api} from "services/api";

export async function useUpdateUserAvatar({form, address}: {form: FormData, address: string}) {
  return api.put(`/user/${address}/avatar`, form)
    .then(({ data }) => data);
}
