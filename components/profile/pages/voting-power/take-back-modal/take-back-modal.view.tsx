import {useTranslation} from "next-i18next";

import Modal from "components/modal";

import {formatStringToCurrency} from "helpers/formatNumber";
import {truncateAddress} from "helpers/truncate-address";

import {Delegation} from "interfaces/curators";

interface TakeBackModalProps {
  delegation: Delegation;
  show?: boolean;
  isTakingBack?: boolean;
  onCloseClick?: () => void;
  onTakeBackClick: () => Promise<void>;
}
export default function TakeBackModal ({
  delegation,
  show,
  isTakingBack,
  onCloseClick,
  onTakeBackClick,
}: TakeBackModalProps) {
  const { t } = useTranslation(["common", "profile"]);
  return(
    <Modal
      show={show}
      title={t("actions.take-back")}
      titlePosition="center"
      onCloseClick={onCloseClick}
      cancelLabel={t("actions.cancel")}
      okLabel={t("actions.confirm")}
      okDisabled={isTakingBack}
      onOkClick={onTakeBackClick}
    >
      <p className="text-center h4">
        <span className="me-2">{t("actions.take-back")}</span>
        <span className="text-purple me-2">
            {formatStringToCurrency(delegation?.amount)} {t("misc.votes")}
          </span>
        <span>
            {t("misc.from")} {truncateAddress(delegation?.to || "", 12, 3)}
          </span>
      </p>
    </Modal>
  );
}