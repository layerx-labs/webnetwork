import { useTranslation } from "next-i18next";

import Modal from "components/modal";

import { truncateAddress } from "helpers/truncate-address";

import { useUserStore } from "x-hooks/stores/user/user.store";

interface WalletMismatchModalProps {
  show: boolean;
  onClose: () => void;
}

export default function WalletMismatchModal({
  show,
  onClose
}: WalletMismatchModalProps) {
  const { t } = useTranslation();

  const { currentUser } = useUserStore();

  const truncatedWallet = truncateAddress(currentUser?.walletAddress);

  return(
    <Modal
      centerTitle
      show={show}
      title={t("modals.wallet-mismatch.title")}
      onCloseClick={onClose}
    >
      <div className="mt-3">
        <p className="xs-medium text-gray text-center">
          <span>{t("modals.wallet-mismatch.description-pre")} </span>
          <span className="text-white">
            {truncatedWallet}
          </span>
          <span> {t("modals.wallet-mismatch.description-pos")}</span>
        </p>

        <p className="xs-medium text-gray text-center">
          {t("modals.wallet-mismatch.recommendation")}
        </p>
      </div>
    </Modal>
  );
}