import React from "react";

import { useTranslation } from "next-i18next";

import { SearchNotificationsPaginated } from "interfaces/notifications";

import { useUpdateReadNotification } from "x-hooks/api/notification/use-update-read-notification";
import { useUpdateReadAllNotifications } from "x-hooks/api/notifications/use-update-read-all-notifications";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
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

  const { mutate: updateReadNotification, isLoading: isReadUploading } =
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

  const { mutate: updateReadAllNotifications, isLoading: isReadAllUploading } =
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

  return (
    <NotificationsListView
      notifications={notifications}
      btnUnreadActive={typeIsUnread}
      hasMorePages={hasMorePages}
      onNextPage={onNextPage}
      onClickMarkAllRead={() => updateReadAllNotifications(currentUser?.walletAddress)}
      onUpdateBtnUreadActive={updateType}
      onClickRead={(id) => updateReadNotification({id: id.toString(), read: true })}
    />
  );
}
