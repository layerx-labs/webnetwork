import { QueryKeys } from "helpers/query-keys";

import { useGetUserByAddress } from "x-hooks/api/user";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";

export function userPointsOfUser() {
  const { currentUser } = useUserStore();

  const { data } = useReactQuery( QueryKeys.totalPointsOfUser(currentUser?.walletAddress), 
                                  () => useGetUserByAddress(currentUser?.walletAddress),
                                  {
                                    staleTime: Infinity,
                                    enabled: !!currentUser?.walletAddress
                                  });

  return {
    totalPoints: data?.totalPoints || 0,
  };
}