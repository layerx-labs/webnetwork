import { useTranslation } from "next-i18next";

import DoubleCheckIcon from "assets/icons/double-check-icon";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";

import { NotificationTextsTypes } from "helpers/constants";

import {
  Notifications,
  SearchNotificationsPaginated,
} from "interfaces/notifications";

interface NotificationListViewProps {
  notifications: SearchNotificationsPaginated;
  btnUnreadActive: boolean;
  hasMorePages: boolean;
  onNextPage: () => void;
  onActiveNotificationChange: (notification: any) => void;
  onClickMarkAllRead: () => void;
  onUpdateBtnUreadActive: (v: boolean) => void;
}

export default function NotificationsListView({
  notifications,
  btnUnreadActive,
  hasMorePages,
  onNextPage,
  onActiveNotificationChange,
  onClickMarkAllRead,
  onUpdateBtnUreadActive,
}: NotificationListViewProps) {
  const { t } = useTranslation("common");

  function renderNotificationRow(item: Notifications, key: number) {
    const className = `h-100 w-100 px-3 py-2 tx-row  cursor-pointer ${
      key !== 0 && "mt-2 border-top-line"
    } `;

    return (
      <div
        className={className}
        onClick={() => onActiveNotificationChange(item)}
        key={item.id}
      >
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex flex-grow-1 me-3">
              <AvatarOrIdenticon address={item?.user?.address} size="sm" />
            </div>
            <div className="d-flex flex-column flex-grow-2 ">
              <span className="xs-medium notification-title text-white mb-3">
                {key}--{NotificationTextsTypes[item.type].title}
              </span>
              <If condition={!!NotificationTextsTypes[item.type].subTitle}>
                <span className="sm-regular mb-3 text-white-50">
                  {NotificationTextsTypes[item.type].subTitle}
                </span>
              </If>

              <div className="d-flex gap-2 text-white-50">
                <span className="sm-regular">Raycast</span>
                <span>•</span>
                <span className="sm-regular">1h ago</span>
              </div>
            </div>
            <div className="d-flex flex-grow-1 ms-2">
              <div className="ball bg-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-list w-100">
      <div className="d-flex flex-row justify-content-between align-items-center mb-4">
        <h4 className="base-medium text-white">
          {t("notifications.title_other")}
        </h4>
        <If condition={!!notifications?.rows?.length}>
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
            onClick={() => onUpdateBtnUreadActive(true)}
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
            {notifications?.count}
          </span>

          <Button
            transparent
            onClick={() => onUpdateBtnUreadActive(false)}
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
          <div className="text-center">
            <span className="caption-small text-light-gray text-uppercase fs-8 family-Medium">
              {t("notifications.no-notifications")}
            </span>
          </div>
        </If>
        <InfiniteScroll handleNewPage={onNextPage} hasMore={hasMorePages}>
          {notifications?.rows?.map(renderNotificationRow)}
        </InfiniteScroll>
      </div>
    </div>
  );
}
