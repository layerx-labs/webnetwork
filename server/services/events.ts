import axios from "axios";
import getConfig from "next/config";

interface BaseParams {
  url: string;
}

interface UpdateUserProfileImageEventParams extends BaseParams {
  id: number;
}

const { serverRuntimeConfig } = getConfig();

function getAxiosInstance(url: string) {
  return axios.create({
    baseURL: `${url}`
  });
}

async function sendUpdateUserProfileImage({
  url,
  id
}: UpdateUserProfileImageEventParams) {
  const api = getAxiosInstance(url);

  return api.get("/standalone/UpdateUserProfileImage", {
    headers: {
      "internal-api-key": serverRuntimeConfig?.internalApiKey,
    },
    params: {
      id
    }
  })
}

export const EventsService = {
  sendUpdateUserProfileImage
}