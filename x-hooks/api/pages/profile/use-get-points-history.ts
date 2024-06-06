import { PointsEvents } from "interfaces/points";

import {api} from "../../../../services/api";

export async function useGetPointsHistory(userAddress: string): Promise<PointsEvents[]> {
  return api.get(`/user/${userAddress}/points/history`)
    .then(({data}) => data)
    .catch(e => {
      console.log(`Error`, e);
      return [];
    })
}