import {api} from "../../../../services/api";

export async function useGetPointsHistory(userAddress: string) {
  return api.get(`/user/${userAddress}/points/history`)
    .then(({data}) => data)
    .catch(e => {
      console.log(`Error`, e);
      return [];
    })
}