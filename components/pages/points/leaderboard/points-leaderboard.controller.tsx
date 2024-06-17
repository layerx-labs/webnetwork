import { PointsLeaderboardView } from "components/pages/points/leaderboard/points-leaderboard.view";

import { TEN_MINUTES_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import { useGetPointsLeaderboard } from "x-hooks/api/points";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";

export function PointsLeaderboard() {
  const { currentUser } = useUserStore();

  const wallet = currentUser?.walletAddress?.toLowerCase();

  const { data: leaderboard } = 
    useReactQuery(QueryKeys.pointsLeaderboard(wallet), 
                  () => useGetPointsLeaderboard({
                    address: currentUser?.walletAddress?.toLowerCase()
                  }),
                  {
                    staleTime: TEN_MINUTES_IN_MS,
                  });

  return(
    <PointsLeaderboardView
      highlight={leaderboard?.user}
      list={leaderboard?.top}
      isConnected={!!currentUser?.walletAddress}
    />
  );
}