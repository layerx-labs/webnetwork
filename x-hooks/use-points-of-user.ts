import { MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import { useGetPointsBase } from "x-hooks/api/points/use-get-points-base";
import { useGetPointsEventsOfUser } from "x-hooks/api/points/use-get-points-events";
import { useGetUserByAddress } from "x-hooks/api/user";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";

export function userPointsOfUser() {
  const { currentUser } = useUserStore();

  const { data: user, invalidate: refreshUser } = 
    useReactQuery(QueryKeys.totalPointsOfUser(currentUser?.walletAddress), 
                  () => useGetUserByAddress(currentUser?.walletAddress),
                  {
                    staleTime: Infinity,
                    enabled: !!currentUser?.walletAddress
                  });

  const { data: pointsBase, invalidate: refreshPointsBase } = 
    useReactQuery(QueryKeys.pointsBase(), 
                  () => useGetPointsBase(),
                  {
                    staleTime: 10 * MINUTE_IN_MS,
                  });

  const { data: collectedPoints, invalidate: refreshCollected } = 
    useReactQuery(QueryKeys.pointsEventsOfUser(currentUser?.walletAddress), 
                  () => useGetPointsEventsOfUser(),
                  {
                    staleTime: 10 * MINUTE_IN_MS,
                    enabled: !!currentUser?.walletAddress,
                  });

  function refresh() {
    refreshUser();
    refreshPointsBase();
    refreshCollected();
  }

  return {
    totalPoints: user?.totalPoints || 0,
    collectedPoints: collectedPoints || [],
    pointsBase: pointsBase || [],
    refresh,
  };
}