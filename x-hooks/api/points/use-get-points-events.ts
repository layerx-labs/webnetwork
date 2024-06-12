import {PointsEvents} from "interfaces/points";

import {api} from "services/api";

export async function useGetPointsEventsOfUser(): Promise<PointsEvents[]> {
  return api
    .get<PointsEvents[]>("/points/events/user")
    .then(({ data }) => data.reverse())
    .catch(() => []);
}