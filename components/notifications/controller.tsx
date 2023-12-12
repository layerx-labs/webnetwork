import { useEffect, useState } from "react";

import { QueryKeys } from "helpers/query-keys";

import { SearchNotificationsPaginated } from "interfaces/notifications";

import { useGetNotifications } from "x-hooks/api/notifications/use-get-notifications";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";

import NotificationsView from "./view";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isUnread, setIsUnread] = useState<boolean>(true);

  const { currentUser } = useUserStore();
  const [notificationsList, setNotificationsList] =
    useState<SearchNotificationsPaginated>();
  const { data: notifications, invalidate: updateNotifications } =
    useReactQuery(QueryKeys.notifications(currentUser?.walletAddress, page?.toString(), isUnread?.toString()),
                  () =>
        useGetNotifications(currentUser?.walletAddress, {
          read: (!isUnread)?.toString() ,
          page: page?.toString()
        }),
                  {
        enabled: !!currentUser?.walletAddress && !!page,
        retry: false,
                  });


  function updateType(v: 'Unread' | 'All') {
    v === 'Unread' ? setIsUnread(true) : setIsUnread(false)
    setPage(1)
  }

  useEffect(() => {
    if (!notifications?.rows?.length) return;

    setNotificationsList((previous) => {
      if (!previous || notifications?.currentPage === 1)
        return {
          ...notifications,
          rows: notifications?.rows,
        };

      return {
        ...previous,
        ...notifications,
        rows: previous?.rows?.concat(notifications?.rows),
      };
    });
  }, [notifications]);

  

  return (
    <NotificationsView
      notificationsList={notificationsList}
      updatePage={() => setPage(+notificationsList?.currentPage + 1)}
      updateType={updateType}
      typeIsUnread={isUnread}
      showOverlay={showOverlay}
      updateShowOverlay={(v: boolean) => setShowOverlay(v)}
      updateNotifications={updateNotifications}
    />
  );
}
