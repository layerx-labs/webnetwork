import { useTranslation } from "next-i18next";

import Modal from "components/modal";

interface WalletMismatchModalView {
  show?: boolean;
  walletAddress: string;
  walletExtensionName: string;
  onCloseClick: () => void;
}
export default function WalletMismatchModalView ({
  show,
  onCloseClick,
  walletAddress,
  walletExtensionName,
}: WalletMismatchModalView) {
  const { t } = useTranslation("common");

  const walletName = t(`wallets.${walletExtensionName}`);

  return (
    <Modal
      centerTitle
      show={show}
      title={t("modals.wallet-mismatch.title")}
      onCloseClick={onCloseClick}
    >
      <div className="mt-3">
        <p className="xs-medium text-gray text-center">
          <span>{t("modals.wallet-mismatch.description-pre")} </span>
          <span className="text-white">
            {walletAddress}
          </span>
          <span> {t("modals.wallet-mismatch.description-pos", { extension: walletName })}</span>
        </p>

        <p className="xs-medium text-gray text-center">
          {t("modals.wallet-mismatch.recommendation", { extension: walletName })}
        </p>
      </div>
    </Modal>
  );
}