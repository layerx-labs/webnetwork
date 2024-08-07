import { useTranslation } from "next-i18next";

import Button from "components/button";
import Modal from "components/modal";

interface TurnOnNotificationsModalViewProps {
  reason: string;
  show: boolean;
  onCloseClick: () => void;
  goToDashboard: () => void;
}

export function TurnOnNotificationsModalView({
  reason,
  show,
  onCloseClick,
  goToDashboard,
}: TurnOnNotificationsModalViewProps) {
  const { t } = useTranslation(["common"]);
  
  return (
    <Modal
      show={show}
      title={t("modals.turn-on-notifications.title")}
      centerTitle={false}
      onCloseClick={onCloseClick}
      footer={
        <div className="col px-0 mx-0">
          <div className="d-flex align-items-center justify-content-between w-100">
            <Button 
              className="border-radius-4 bg-gray-800 border-gray-700 text-capitalize xs-medium py-2 px-3 mx-0"
              onClick={onCloseClick}
            >
              {t("actions.dismiss")}
            </Button>
            
            <Button 
              className="border-radius-4 text-capitalize xs-medium py-2 px-3" 
              onClick={goToDashboard}
            >
              {t("modals.turn-on-notifications.go-to-dashboard")}
            </Button>
          </div>
        </div>
      }
    >
      <div className="d-flex flex-column align-items-center gap-3 pb-3">
        <p className="text-center text-gray-300 base-medium font-weight-medium m-0">
          {t("modals.turn-on-notifications.description", {
            reason: t(`modals.turn-on-notifications.reasons.${reason}`)
          })}
        </p>
      </div>
    </Modal>
  );
}