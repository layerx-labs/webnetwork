import { useTranslation } from "next-i18next";

import DoubleCheckIcon from "assets/icons/double-check-icon";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";

import { getTimeDifferenceInWords } from "helpers/formatDate";

import {
  Notifications,
  SearchNotificationsPaginated,
} from "interfaces/notifications";

interface NotificationListViewProps {
  notifications: SearchNotificationsPaginated;
  btnUnreadActive: boolean;
  hasMorePages: boolean;
  onNextPage: () => void;
  onClickMarkAllRead: () => void;
  onClickRead: (id: number) => void;
  onUpdateBtnUreadActive: (v: 'Unread' | 'All') => void;
}

export default function NotificationsListView({
  notifications,
  btnUnreadActive,
  hasMorePages,
  onNextPage,
  onClickMarkAllRead,
  onClickRead,
  onUpdateBtnUreadActive,
}: NotificationListViewProps) {
  const { t } = useTranslation("common");

  function renderNotificationRow(item: Notifications, key: number) {
    const className = `h-100 w-100 px-3 py-2 tx-row ${
      key !== 0 && "mt-2 border-top-line"
    } `;
    const regex = /<div id="avatar">([^<]+)<\/div>/;
    const extractAddress = item?.template?.match(regex)?.[1] || null;
    const template = item?.template?.replace("%DATE%",
                                             getTimeDifferenceInWords(new Date(item.createdAt), new Date()));
    const finalTemplate = template?.replace(regex, '')
    
    return (
      <div className={className} key={item?.id}>
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex" key={item?.id}>
              <AvatarOrIdenticon address={extractAddress} size="md" />
              <div dangerouslySetInnerHTML={{ __html: finalTemplate }} />
            </div>

            <div className="d-flex ms-2">
              <If condition={!item?.read}>
                <div
                  className="ball bg-primary cursor-pointer hover-white"
                  onClick={() => onClickRead(item?.id)}
                />
              </If>
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
            onClick={() => onUpdateBtnUreadActive('Unread')}
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
            onClick={() => onUpdateBtnUreadActive('All')}
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
              {btnUnreadActive ? t("notifications.no-unread-notifications") : t("notifications.no-notifications")}
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
