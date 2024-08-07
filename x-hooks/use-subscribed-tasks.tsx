import {useEffect} from "react";

import {QueryKeys} from "../helpers/query-keys";
import {getSubscriptionsList} from "./api/task/get-subscriptions-list";
import {useUserStore} from "./stores/user/user.store";
import useReactQuery from "./use-react-query";

export function useSubscribedTasks() {
  const { currentUser } = useUserStore();
  
  const {data: subscriptions, isFetching: loadingSubscriptions, refetch: refetchSubscriptions} =
    useReactQuery(QueryKeys.taskSubscriptions(currentUser?.id), () => getSubscriptionsList(), {enabled: !!currentUser?.walletAddress, staleTime: 1, initialData: []})

  useEffect(() => {
    const handler = () => { refetchSubscriptions() };

    window.addEventListener("task-unsubscribe", handler);
    return () => {
      window.removeEventListener("task-unsubscribe", handler);
    }
  }, [])

  return {
    subscriptions,
    loadingSubscriptions,
    refetchSubscriptions,
  }
}