import { MouseEvent } from "react";

import { SubscriptionTaskButtonView } 
  from "components/notifications/subscription-task-button/subscription-task-button.view";

import { useUserStore } from "x-hooks/stores/user/user.store";
import { useTaskSubscription } from "x-hooks/use-task-subscription";

interface SubscriptionTaskButtonProps {
  taskId: number;
  variant?: "icon" | "text";
}

export function SubscriptionTaskButton({
  taskId,
  variant = "text",
}: SubscriptionTaskButtonProps) {
  const { currentUser } = useUserStore();
  const { isSubscribed, subscribe, unsubscribe, isSubscribing, isUnsubscribing } = useTaskSubscription();

  const isConnected = !!currentUser?.walletAddress;

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    e?.stopPropagation();

    if (isSubscribed(taskId))
      unsubscribe(taskId);
    else
      subscribe(taskId);
  }

  return(
    <SubscriptionTaskButtonView
      isSubscribed={isSubscribed(taskId)}
      isDisabled={isSubscribing || isUnsubscribing}
      isConnected={isConnected}
      variant={variant}
      onClick={onClick}
    />
  );
}