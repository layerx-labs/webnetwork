import {useEffect, useState} from "react";

import {useRouter} from "next/router";

import {QueryKeys} from "helpers/query-keys";


import {useUpdateReadNotification} from "x-hooks/api/notification/use-update-read-notification";
import {useGetNotifications} from "x-hooks/api/notifications/use-get-notifications";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

import {SearchNotificationsPaginated} from "../../interfaces/user-notification";
import NotificationsView from "./view";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isUnread, setIsUnread] = useState<boolean>(true);
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [notificationsList, setNotificationsList] =
    useState<SearchNotificationsPaginated>();
  const { data: notifications, invalidate: updateNotifications } =
    useReactQuery(QueryKeys.notifications(currentUser?.walletAddress,
                                          page?.toString(),
                                          isUnread?.toString()),
                  () =>
        useGetNotifications(currentUser?.walletAddress, {
          read: !isUnread ? null : (!isUnread)?.toString(),
          page: page?.toString(),
        }),
                  {
        enabled: !!currentUser?.walletAddress && !!page,
        retry: false,
                  });
  const { mutate: updateReadNotification, isLoading: isLoadingReadNotification } = useReactQueryMutation({
    mutationFn: useUpdateReadNotification,
    onSuccess: () => {
      updateNotifications();
    },
  });

  function updateType(v: "Unread" | "All") {
    v === "Unread" ? setIsUnread(true) : setIsUnread(false);
    setPage(1);
  }

  useEffect(() => {
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

  useEffect(() => {
    router.events.on("routeChangeStart", updateNotifications);
    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", updateNotifications);
    };
  }, [router]);

  useEffect(() => {
    if (router.query?.fromEmail && currentUser?.walletAddress && !isLoadingReadNotification) {
      updateReadNotification({
        id: router.query?.fromEmail?.toString(),
        read: true,
      });
    }
  }, [currentUser?.walletAddress, router.query?.fromEmail]);

  return (
    <NotificationsView
      notificationsList={notificationsList}
      updatePage={() => setPage(+notificationsList?.currentPage + 1)}
      updateType={updateType}
      typeIsUnread={isUnread}
      showOverlay={showOverlay}
      updateShowOverlay={(v: boolean) => setShowOverlay(v)}
      updateNotifications={updateNotifications}
      hasUnread={notificationsList?.rows?.length > 0 && !showOverlay}
    />
  );
}
