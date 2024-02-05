import {ReactNode} from "react";

import {useTranslation} from "next-i18next";

import Button from "components/button";
import ConnectWalletModal from "components/connections/connect-wallet-modal/view";
import {ResponsiveEle} from "components/responsive-wrapper";

interface ConnectWalletButtonViewProps {
  children?: ReactNode;
  asModal?: boolean;
  isLoading?: boolean;
  isModalVisible?: boolean;
  isConnected?: boolean;
  buttonColor: string;
  onConnectClick: () => void;
}

export default function ConnectWalletButtonView ({
  children,
  asModal,
  isLoading,
  isModalVisible,
  isConnected,
  buttonColor,
  onConnectClick,
}: ConnectWalletButtonViewProps) {
  const { t } = useTranslation(["common", "connect-wallet-button"]);

  if (asModal) {
    if (isLoading) return <></>;

    return(
      <ConnectWalletModal
        isVisible={isModalVisible}
        onConnectClick={onConnectClick}
      />
    );
  }

  if (!isConnected)
    return (
      <Button
        color={buttonColor}
        className="text-dark bg-opacity-100"
        data-testid="connect-wallet-button"
        onClick={onConnectClick}>
        <span>
          <ResponsiveEle mobileView={t("main-nav.connect")}
                         desktopView={t("main-nav.connect-wallet")} />
        </span>
      </Button>
    );

  return <>{children}</>;
}