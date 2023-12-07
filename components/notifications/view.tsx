import { OverlayTrigger, Popover } from "react-bootstrap";

import BellIcon from "assets/icons/bell-icon";

import Button from "components/button";
import NotificationsList from "components/notifications/list/controller";

import { SearchNotificationsPaginated } from "interfaces/notifications";

export default function NotificationsView({
  notificationsList,
  updatePage,
  showOverlay,
  updateShowOverlay,
  loading,
}: {
  notificationsList: SearchNotificationsPaginated;
  updatePage: () => void;
  showOverlay: boolean;
  updateShowOverlay: (v: boolean) => void;
  loading?: boolean;
}) {
  const overlay = (
    <Popover id="notifications-indicator">
      <Popover.Body className="bg-gray-850 border border-gray-800 p-3">
        <NotificationsList
          notifications={notificationsList}
          onNextPage={updatePage}
          onActiveNotificationChange={() => console.log}
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
            className="bg-gray-850 border-gray-850 rounded p-2"
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
