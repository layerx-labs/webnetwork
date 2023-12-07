import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { QueryKeys } from "helpers/query-keys";

import { SearchNotificationsPaginated } from "interfaces/notifications";

import { useGetNotifications } from "x-hooks/api/notifications/use-get-notifications";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";

import NotificationsView from "./view";

export default function Notifications() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const { currentUser } = useUserStore();
  const { query } = useRouter();
  const [notificationsList, setNotificationsList] =
    useState<SearchNotificationsPaginated>();
  const { data: notifications } = useReactQuery(QueryKeys.notifications(currentUser?.walletAddress, page?.toString()),
                                                () =>
      useGetNotifications(currentUser?.walletAddress, {
        page: page?.toString(),
      }),
                                                {
      enabled: !!currentUser?.walletAddress && !!page,
      retry: false,
                                                });

  useEffect(() => {
    console.log("useEffect notificationsList", notifications, page);
    if (!notifications?.rows?.length) return;

    setNotificationsList((previous) => {
      console.log("previous", previous);
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

  console.log("notifications", notificationsList, page);

  return (
    <NotificationsView
      notificationsList={notificationsList}
      updatePage={() => setPage(+notificationsList?.currentPage + 1)}
      showOverlay={showOverlay}
      updateShowOverlay={(v: boolean) => setShowOverlay(v)}
      loading={loading}
    />
  );
}
