import { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import BellIcon from "assets/icons/bell-icon";

import Button from "components/button";
import NotificationsList from "components/notification/list/controller";

export default function NotificationButton() {
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlay = (
    <Popover id="notifications-indicator">
      <Popover.Body className="bg-gray-850 border border-gray-800 p-3">
        <NotificationsList onActiveNotificationChange={() => console.log} />
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
        onToggle={(next) => setShowOverlay(next)}
        overlay={overlay}
      >
        <div>
          <Button
            className="bg-gray-850 border-gray-850 rounded p-2"
            transparent
            onClick={() => setShowOverlay(!showOverlay)}
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
