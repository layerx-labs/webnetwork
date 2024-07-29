import {AxiosError} from "axios";
import {useTranslation} from "next-i18next";

import {TEN_MINUTES_IN_MS} from "helpers/constants";
import {QueryKeys} from "helpers/query-keys";

import {useSubscribeToTask, useUnsubscribeToTask} from "x-hooks/api/task";
import {useGetUserNotificationSettings} from "x-hooks/api/user/use-get-notification-settings";
import {useToastStore} from "x-hooks/stores/toasts/toasts.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export function useTaskSubscription() {
  const { t } = useTranslation("bounty");

  const { addError } = useToastStore();
  const { currentUser } = useUserStore();

  const queryKey = QueryKeys.userNotificationSettings(currentUser?.walletAddress);

  const { data: notificationSettings, invalidate } = 
    useReactQuery(queryKey,
                  () => useGetUserNotificationSettings(currentUser?.walletAddress),
                  {
                    enabled: !!currentUser?.walletAddress,
                    staleTime: TEN_MINUTES_IN_MS,
                  });

  const { mutate: subscribe, isPending: isSubscribing } = useReactQueryMutation({
    queryKey,
    mutationFn: useSubscribeToTask,
    onError: (error: AxiosError<Error>) => addError(t("errors.failed-to-subscribe"), error.response.data.message),
  });

  const { mutate: unsubscribe, isPending: isUnsubscribing } = useReactQueryMutation({
    queryKey,
    mutationFn: useUnsubscribeToTask,
    onError: (error: AxiosError<Error>) => addError(t("errors.failed-to-unsubscribe"), error.response.data.message),
  });

  function isSubscribed(taskId: number) {
    if (!notificationSettings?.subscriptions) return false;
    return !!notificationSettings.subscriptions.find(subscription => subscription === taskId);
  }

  return {
    isSubscribed,
    subscribe,
    unsubscribe,
    refresh: invalidate,
    isSubscribing, 
    isUnsubscribing
  };
}