import { PointsEvents } from "interfaces/points";

import { api } from "services/api";

export async function useGetPointsEventsOfUser(): Promise<PointsEvents[]> {
  return api
  .get("/points/events/user")
  .then(({ data }) => data)
  .catch(() => []);
}