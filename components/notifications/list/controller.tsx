import React from "react";

import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";


import {SearchNotificationsPaginated, UserNotification} from "interfaces/user-notification";

import {useUpdateReadNotification} from "x-hooks/api/notification/use-update-read-notification";
import {useUpdateReadAllNotifications} from "x-hooks/api/notifications/use-update-read-all-notifications";
import {useToastStore} from "x-hooks/stores/toasts/toasts.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

import NotificationsListView from "./view";

interface NotificationListProps {
  notifications: SearchNotificationsPaginated;
  updateNotifications: () => void;
  onNextPage: () => void;
  updateType: (v: 'Unread' | 'All') => void;
  typeIsUnread: boolean;
}

export default function NotificationsList({
  onNextPage,
  notifications,
  updateNotifications,
  updateType,
  typeIsUnread
}: NotificationListProps) {
  const { t } = useTranslation("common");
  const hasNotifications = !!notifications?.count;
  const hasMorePages =
    hasNotifications && notifications?.currentPage < notifications?.pages;

  const { addSuccess, addError } = useToastStore();
  const { currentUser } = useUserStore();
  const router = useRouter();
  const { getURLWithNetwork } = useMarketplace();
  
  const { mutate: updateReadNotification } =
  useReactQueryMutation({
    mutationFn: useUpdateReadNotification,
    onSuccess: () => {
      updateNotifications();
      addSuccess(t("notifications.title_other"), t("notifications.success.update-read"));
    },
    onError: () => {
      addError(t("notifications.title_other"), t("notifications.errors.update-notifications"));
    },
  });

  const { mutateAsync: updateReadAllNotifications } =
  useReactQueryMutation({
    mutationFn: useUpdateReadAllNotifications,
    onSuccess: () => {
      updateNotifications();
      addSuccess(t("notifications.title_other"), t("notifications.success.update-read"));
    },
    onError: () => {
      addError(t("notifications.title_other"), t("notifications.errors.update-notifications"));
    },
  });

  async function redirectAndMarkRead(notif: UserNotification, {network, link}: { link: string; network: string }) {

    if (!notif?.read)
      await new Promise((onSuccess, onError) => {
        updateReadNotification({id: notif.uuid.toString(), read: true}, {onSuccess, onError})
      })



    await router.push(getURLWithNetwork(link, {network}));
  }

  return (
    <NotificationsListView
      notifications={notifications}
      btnUnreadActive={typeIsUnread}
      hasMorePages={hasMorePages}
      onNextPage={onNextPage}
      onClickMarkAllRead={() => updateReadAllNotifications(currentUser?.walletAddress)}
      onUpdateBtnUreadActive={updateType}
      onClickRead={(id) => updateReadNotification({id: id.toString(), read: true })}
      redirectTo={redirectAndMarkRead}
    />
  );
}
