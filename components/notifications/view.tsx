import {OverlayTrigger, Popover} from "react-bootstrap";

import BellIcon from "assets/icons/bell-icon";

import Button from "components/button";
import NotificationsList from "components/notifications/list/controller";

import {SearchNotificationsPaginated} from "../../interfaces/user-notification";

export default function NotificationsView({
  notificationsList,
  updatePage,
  showOverlay,
  updateShowOverlay,
  loading,
  updateNotifications,
  updateType,
  typeIsUnread,
  hasUnread,
}: {
  notificationsList: SearchNotificationsPaginated;
  updatePage: () => void;
  showOverlay: boolean;
  updateShowOverlay: (v: boolean) => void;
  loading?: boolean;
  updateNotifications: () => void;
  updateType: (v: 'Unread' | 'All') => void;
  typeIsUnread: boolean;
  hasUnread: boolean;
}) {
  const overlay = (
    <Popover id="notifications-indicator">
      <Popover.Body className="bg-gray-850 border border-gray-800 p-3">
        <NotificationsList
          notifications={notificationsList}
          onNextPage={updatePage}
          updateNotifications={updateNotifications}
          updateType={updateType}
          typeIsUnread={typeIsUnread}
        />
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger
        trigger="click"
        placement={"bottom-end"}
        show={showOverlay}
        rootClose={true}
        onToggle={updateShowOverlay}
        overlay={overlay}
      >
        <div>
          <Button
            id="notification-icon"
            className={`bg-gray-850 border-gray-850 rounded p-2 ${hasUnread ? "unread" : ""}`}
            transparent
            onClick={() => updateShowOverlay(!showOverlay)}
          >
            {(loading && (
              <span className="spinner-border spinner-border-sm" />
            )) || <BellIcon />}
          </Button>
        </div>
      </OverlayTrigger>
    </>
  );
}
