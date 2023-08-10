import { useTranslation } from "next-i18next";

import Modal from "components/modal";

import { useAppState } from "contexts/app-state";
import { changeWalletMismatch } from "contexts/reducers/change-spinners";

import { truncateAddress } from "helpers/truncate-address";

export default function WalletMismatchModal() {
  const { t } = useTranslation();

  const { state, dispatch } = useAppState();

  const isVisible = state.spinners?.walletMismatch;
  const truncatedWallet = truncateAddress(state.currentUser?.walletAddress);

  function onClose() {
    dispatch(changeWalletMismatch(false));
  }

  return(
    <Modal
      centerTitle
      show={isVisible}
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