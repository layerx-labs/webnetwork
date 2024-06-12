import {api} from "services/api";

interface UseUpdateUserAvatarProps  {
  address: string;
  avatar: string;
}

export async function useUpdateUserAvatar({
  address,
  avatar
}: UseUpdateUserAvatarProps) {

  return api.put(`/user/${address}/avatar`, {file: avatar})
    .then(({ data }) => data);
}
