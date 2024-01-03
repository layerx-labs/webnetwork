import { WalletSelector } from "@layerx-labs/dappkit-react";

import Modal from "components/modal";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";

export default function WalletSelectorModal () {
  const { walletSelectorModal, updateWalletSelectorModal } = useLoadersStore();

  function onCloseClick () {
    updateWalletSelectorModal(false);
  }

  return(
    <Modal
      title="Select a wallet"
      subTitle="Please select a wallet to be connect with this website."
      show={walletSelectorModal}
      onCloseClick={onCloseClick}
      cancelLabel={"Cancel"}
      backdrop
    >
      <WalletSelector
        availableWallets={["Metamask", "Coinbase", "WalletConnect", "GnosisSafe"]}
        onConnectorConnect={console.log}
      />
    </Modal>
  );
}