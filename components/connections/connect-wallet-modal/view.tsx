import { useTranslation } from "next-i18next";
import Image from "next/image";

import metamaskLogo from "assets/metamask.png";

import Button from "components/button";
import TermsAndConditions from "components/common/terms-and-conditions/view";
import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import Modal from "components/modal";

interface ConnectWalletModalProps {
  isVisible?: boolean;
  hasWeb3Connection?: boolean;
  onConnectClick: () => void;
}

export default function ConnectWalletModal({
  isVisible,
  hasWeb3Connection,
  onConnectClick
} : ConnectWalletModalProps) {
  const { t } = useTranslation(["common", "connect-wallet-button"]);

  return(
    <Modal
      title={t("connect-wallet-button:title")}
      titlePosition="center"
      centerTitle
      titleClass="h3 text-white bg-opacity-100"
      show={isVisible}
      data-testid="connect-wallet-modal"
    >
      <div className="d-flex flex-column text-center align-items-center">
        <strong className="caption-small d-block text-uppercase text-white-50 mb-3 pb-1">
          {t("connect-wallet-button:this-page-needs-access-to-your-wallet-address")}
        </strong>

        <div className="d-flex justify-content-center align-items-center w-100">
          <If
            condition={hasWeb3Connection}
            otherwise={
              <div className="my-3">
                <ContextualSpan context="danger">
                  {t("connect-wallet-button:web3Connection-error")}
                </ContextualSpan>

                <span className="p text-danger ms-3">
                  {t("connect-wallet-button:refresh-page")}
                </span>
              </div>
            }
          >
            <Button
              color="dark-gray"
              className="rounded-8 text-white p-3 d-flex text-center justify-content-center align-items-center w-75"
              onClick={onConnectClick}
            >
              <Image src={metamaskLogo} width={15} height={15} />
              <span className="text-white text-uppercase ms-2 caption-large">
                {t("misc.metamask")}
              </span>
            </Button>
          </If>
        </div>

        <TermsAndConditions />
      </div>
    </Modal>
  );
}