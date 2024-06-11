import { PointsLeaderboard } from "interfaces/points";

import { api } from "services/api";

interface useGetPointsLeaderboardParams {
  address?: string;
}

export async function useGetPointsLeaderboard(params: useGetPointsLeaderboardParams): Promise<PointsLeaderboard> {
  return api
    .get("/points/leaderboard", { params })
    .then(({ data }) => data)
    .catch(() => ({ top: [], user: null }));
}