import { ReactNode } from "react";

import { useTranslation } from "next-i18next";
import Image from "next/image";

import metamaskLogo from "assets/metamask.png";

import Button from "components/button";
import TermsAndConditions from "components/common/terms-and-conditions/view";
import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import Modal from "components/modal";
import ResponsiveWrapper from "components/responsive-wrapper";

interface ConnectWalletButtonViewProps {
  children?: ReactNode;
  asModal?: boolean;
  isLoading?: boolean;
  isModalVisible?: boolean;
  hasWeb3Connection?: boolean;
  isConnected?: boolean;
  buttonColor: string;
  onConnectClick: () => void;
}

export default function ConnectWalletButtonView ({
  children,
  asModal,
  isLoading,
  isModalVisible,
  hasWeb3Connection,
  isConnected,
  buttonColor,
  onConnectClick,
}: ConnectWalletButtonViewProps) {
  const { t } = useTranslation(["common", "connect-wallet-button"]);

  if (asModal) {
    if (isLoading) return <></>;

    return (
      <Modal
        title={t("connect-wallet-button:title")}
        titlePosition="center"
        centerTitle
        titleClass="h3 text-white bg-opacity-100"
        show={isModalVisible}
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
              <div 
                className="rounded-8 bg-dark-gray text-white p-3 d-flex text-center justify-content-center align-items-center w-75 cursor-pointer"
                onClick={onConnectClick}
              >
                <Image src={metamaskLogo} width={15} height={15} />
                <span className="text-white text-uppercase ms-2 caption-large">
                  {t("misc.metamask")}
                </span>
              </div>
            </If>
          </div>

          <TermsAndConditions />
        </div>
      </Modal>
    );
  }

  if (!isConnected)
    return (
      <Button
        color={buttonColor}
        className="text-dark bg-opacity-100"
        onClick={onConnectClick}>
        <span>
          <ResponsiveWrapper xs={true} xl={false}>
            {t("main-nav.connect")}
          </ResponsiveWrapper>

          <ResponsiveWrapper xs={false} xl={true}>
            {t("main-nav.connect-wallet")}
          </ResponsiveWrapper>
        </span>
      </Button>
    );

  return <>{children}</>;
}