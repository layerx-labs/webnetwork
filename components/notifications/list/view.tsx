import {useTranslation} from "next-i18next";

import DoubleCheckIcon from "assets/icons/double-check-icon";

import Button from "components/button";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";

import {SearchNotificationsPaginated, UserNotification,} from "../../../interfaces/user-notification";
import NotificationRow from "../row/view";

interface NotificationListViewProps {
  notifications: SearchNotificationsPaginated;
  btnUnreadActive: boolean;
  hasMorePages: boolean;
  onNextPage: () => void;
  onClickMarkAllRead: () => void;
  onClickRead: (id: number) => void;
  onUpdateBtnUreadActive: (v: "Unread" | "All") => void;
  redirectTo: (href: UserNotification, query: {chain: string; link: string; network: string}) => void;
}

export default function NotificationsListView({
  notifications,
  btnUnreadActive,
  hasMorePages,
  onNextPage,
  onClickMarkAllRead,
  onClickRead,
  onUpdateBtnUreadActive,
  redirectTo,
}: NotificationListViewProps) {
  const { t } = useTranslation("common");

  return (
    <div className="notification-list w-100">
      <div className="d-flex flex-row justify-content-between align-items-center mb-4">
        <h4 className="base-medium text-white">
          {t("notifications.title_other")}
        </h4>
        <If condition={!!notifications?.rows?.length && btnUnreadActive}>
          <Button className="px-0" onClick={onClickMarkAllRead} transparent>
            <div className="xs-small text-gray-150 d-flex align-items-center justify-content-center">
              <DoubleCheckIcon />
              <span className="xs-small text-normal">
                {t("notifications.mark-read")}
              </span>
            </div>
          </Button>
        </If>
      </div>
      <div className="border-bottom border-gray-800">
        <div
          className={`d-flex align-items-center ${
            btnUnreadActive ? "unread-active" : "all-active"
          } pb-1`}
        >
          <Button
            transparent
            onClick={() => onUpdateBtnUreadActive("Unread")}
            className="p-0 ms-2"
          >
            <span
              className={`${
                btnUnreadActive ? "text-white" : "text-gray-500"
              } xs-medium text-normal`}
            >
              {t("notifications.unread")}
            </span>
          </Button>

          <span className="p xs-medium text-gray-500 bg-gray-800 border-radius-4 p-1 px-2 ms-2">
            {notifications?.count || 0}
          </span>

          <Button
            transparent
            onClick={() => onUpdateBtnUreadActive("All")}
            className="p-0 ms-4 ps-2"
          >
            <span
              className={`${
                btnUnreadActive ? "text-gray-500" : "text-white"
              }  xs-medium text-normal`}
            >
              {t("filters.all")}
            </span>
          </Button>
        </div>
      </div>
      <div className="overflow-auto tx-container mt-1 pt-2">
        <If condition={!notifications || !notifications?.rows?.length}>
          <div className="text-center mt-2">
            <span className="caption-small text-light-gray text-uppercase fs-8 family-Medium">
              {btnUnreadActive
                ? t("notifications.no-unread-notifications")
                : t("notifications.no-notifications")}
            </span>
          </div>
        </If>
        <InfiniteScroll handleNewPage={onNextPage} hasMore={hasMorePages}>
          {notifications?.rows?.map((item, key) => (
            <NotificationRow
              item={item}
              key={key}
              redirectTo={redirectTo}
              onClickRead={onClickRead}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
