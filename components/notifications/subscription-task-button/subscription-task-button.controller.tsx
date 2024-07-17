import { useState } from "react";

import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import { SubscriptionTaskButtonView } 
  from "components/notifications/subscription-task-button/subscription-task-button.view";

import { useSubscribeToTask, useUnsubscribeToTask } from "x-hooks/api/task";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

interface SubscriptionTaskButtonProps {
  taskId: number;
  variant?: "icon" | "text";
}

export function SubscriptionTaskButton({
  taskId,
  variant = "text",
}: SubscriptionTaskButtonProps) {
  const { t } = useTranslation("bounty");

  const [isSubscribed, setIsSubscribed] = useState(false);

  const { addError } = useToastStore();

  const { mutate: subscribe, isPending: isSubscribing } = useReactQueryMutation({
    mutationFn: useSubscribeToTask,
    onSuccess: () => setIsSubscribed(true),
    onError: (error: AxiosError<Error>) => addError(t("errors.failed-to-subscribe"), error.response.data.message),
  });

  const { mutate: unsubscribe, isPending: isUnsubscribing } = useReactQueryMutation({
    mutationFn: useUnsubscribeToTask,
    onSuccess: () => setIsSubscribed(false),
    onError: (error: AxiosError<Error>) => addError(t("errors.failed-to-unsubscribe"), error.response.data.message),
  });

  function onClick() {
    if (isSubscribed)
      unsubscribe(taskId);
    else
      subscribe(taskId);
  }

  return(
    <SubscriptionTaskButtonView
      isSubscribed={isSubscribed}
      isDisabled={isSubscribing || isUnsubscribing}
      variant={variant}
      onClick={onClick}
    />
  );
}