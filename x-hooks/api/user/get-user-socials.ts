import {api} from "../../../services/api";

export const getUserSocials = (address: string) =>
  api.get(`/user/${address}`)