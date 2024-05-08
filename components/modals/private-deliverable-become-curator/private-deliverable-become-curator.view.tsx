import { useTranslation } from "next-i18next";

import Modal from "components/modal";

interface PrivateDeliverableBecomeCuratorModalProps {
  show: boolean;
  marketplace: string;
  onClose: () => void;
  onOkClick: () => void;
}

export default function PrivateDeliverableBecomeCuratorModalView({
  show,
  marketplace,
  onClose,
  onOkClick,
}: PrivateDeliverableBecomeCuratorModalProps) {
  const { t } = useTranslation(["bounty", "common"]);

  return(
    <Modal
      centerTitle
      show={show}
      title={t("modals.become-curator.title")}
      okLabel={t("modals.become-curator.ok-label")}
      cancelLabel={t("common:actions.cancel")}
      onCloseClick={onClose}
      onOkClick={onOkClick}
    >
      <div className="text-justify mt-3">
        {t("modals.become-curator.description-pre")}{" "}
        <span className="text-primary">{marketplace}</span>{" "}
        {t("modals.become-curator.description-pos")}
      </div>
    </Modal>
  );
}