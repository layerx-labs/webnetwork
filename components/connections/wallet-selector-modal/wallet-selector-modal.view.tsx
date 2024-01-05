import { WalletSelector, ConnectorsNames } from "@layerx-labs/dappkit-react";
import { Web3Connection } from "@taikai/dappkit";
import { useTranslation } from "next-i18next";

import Modal from "components/modal";

interface WalletSelectorModalViewProps {
  show: boolean;
  availableWallets: ConnectorsNames[];
  onCloseClick: () => void;
  onConnectorConnect: (connection: Web3Connection) => Promise<void>;
  onConnectorDisconnect?: () => void;
}

export default function WalletSelectorModalView ({
  show,
  availableWallets,
  onCloseClick,
  onConnectorConnect,
  onConnectorDisconnect,
}: WalletSelectorModalViewProps) {
  const { t } = useTranslation("common");
  
  return (
    <Modal
      title={t("modals.wallet-selector.title")}
      subTitle={t("modals.wallet-selector.subtitle")}
      show={show}
      onCloseClick={onCloseClick}
      cancelLabel={t("actions.cancel")}
      backdrop
    >
      <WalletSelector
        availableWallets={availableWallets}
        onConnectorConnect={onConnectorConnect}
        onConnectorDisconnect={onConnectorDisconnect}
      />
    </Modal>
  );
}