import React, { useState } from "react";

import { SearchNotificationsPaginated } from "interfaces/notifications";

import NotificationsListView from "./view";
interface NotificationListProps {
  notifications: SearchNotificationsPaginated;
  onNextPage: () => void;
  onActiveNotificationChange: (notification: any) => void;
}

export default function NotificationsList({
  onNextPage,
  notifications,
  onActiveNotificationChange,
}: NotificationListProps) {
  const hasNotifications = !!notifications?.count;
  const hasMorePages =
    hasNotifications && notifications?.currentPage < notifications?.pages;
  const [btnUnreadActive, setBtnUreadActive] = useState<boolean>(true);

  return (
    <NotificationsListView
      notifications={notifications}
      btnUnreadActive={btnUnreadActive}
      hasMorePages={hasMorePages}
      onNextPage={onNextPage}
      onActiveNotificationChange={onActiveNotificationChange}
      onClickMarkAllRead={() => console.log}
      onUpdateBtnUreadActive={setBtnUreadActive}
    />
  );
}
