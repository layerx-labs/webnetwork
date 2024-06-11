import {PointsBase} from "interfaces/points-system";

import {api} from "services/api";

export async function useGetPointsBase(): Promise<PointsBase[]> {
  return api.get("/points/base")
    .then(({ data }) => data)
    .catch(() => []);
}