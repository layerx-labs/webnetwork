import { readFileData } from "helpers/file-reader";

import { api } from "services/api";

interface UseUpdateUserAvatarProps  {
  address: string;
  avatar: File;
}

export async function useUpdateUserAvatar({
  address,
  avatar
}: UseUpdateUserAvatarProps) {
  const avatarFile = await readFileData(avatar);
  
  return api.put(`/user/${address}/avatar`, { files: [avatarFile] })
    .then(({ data }) => data);
}
