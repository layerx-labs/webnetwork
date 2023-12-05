import React, { useState } from "react";

import { useTranslation } from "next-i18next";

import DoubleCheckIcon from "assets/icons/double-check-icon";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import If from "components/If";

import { useStorageTransactions } from "x-hooks/use-storage-transactions";

import { data } from "../mock.data";

interface NotificationListProps {
  onActiveNotificationChange: (notification: any) => void;
}

export default function NotificationsList({
  onActiveNotificationChange,
}: NotificationListProps) {
  const { t } = useTranslation("common");
  const [btnUnreadActive, setBtnUreadActive] = useState<boolean>(true);

  const { deleteFromStorage } = useStorageTransactions();

  const notifications = data;

  function renderNotificationRow(item: any, key: number) {
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
              <AvatarOrIdenticon
                address="0xf15cc0ccbdda041e2508b829541917823222f364"
                size="sm"
              />
            </div>
            <div className="d-flex flex-column flex-grow-2 ">
              <span className="xs-medium notification-title text-white mb-3">
                User-handle name commented on your bounty #123
              </span>
              <span className="sm-regular mb-3 text-white-50">
                This is the space where we can see a little bit of the comment
                this user left on this specific bounty.
              </span>
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
        <If condition={!!notifications.length}>
          <Button className="px-0" onClick={deleteFromStorage} transparent>
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
            onClick={() => setBtnUreadActive(true)}
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
            10
          </span>

          <Button
            transparent
            onClick={() => setBtnUreadActive(false)}
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
        <If condition={!notifications || !notifications.length}>
          <div className="text-center">
            <span className="caption-small text-light-gray text-uppercase fs-8 family-Medium">
              {t("notifications.no-notifications")}
            </span>
          </div>
        </If>
        {notifications.map(renderNotificationRow)}
      </div>
    </div>
  );
}
