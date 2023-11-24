import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import Button, { ButtonProps } from "components/button";
import WalletMismatchModal from "components/modals/wallet-mismatch/controller";
import WrongNetworkModal from "components/wrong-network-modal";

import { UNSUPPORTED_CHAIN } from "helpers/constants";
import { AddressValidator } from "helpers/validators/address";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useDao } from "x-hooks/use-dao";
import { useDappkitConnectionInfo } from "x-hooks/use-dappkit";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

export default function ContractButton({
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const { t } = useTranslation(["common"]);
  const [isMismatchModalVisible, setIsMismatchModalVisible] = useState(false);
  const [isNetworkModalVisible, setIsNetworkModalVisible] = useState(false);

  const { loading } = useLoadersStore();
  const { currentUser } = useUserStore();
  const { query, pathname } = useRouter();
  const { changeNetwork } = useDao();
  const { addError, addWarning } = useToastStore();
  const marketplace = useMarketplace();
  const { service: daoService, serviceStarting } = useDaoStore();
  const { supportedChains, connectedChain } = useSupportedChain();
  const { updateWeb3Dialog } = useLoadersStore();
  const connectionInfo = useDappkitConnectionInfo();

  const isRequired = [
    pathname?.includes("new-network"),
    pathname?.includes("/[network]/[chain]/profile")
  ].some(c => c);

  function onCloseModal(variant: "WalletMismatchModal" | "WrongNetworkModal") {
    variant === "WalletMismatchModal"
      ? setIsMismatchModalVisible(false)
      : setIsNetworkModalVisible(false);
  }

  function changeShowNetworkModal() {
    if (!supportedChains?.length || loading?.isLoading) {
      setIsNetworkModalVisible(false);
      return;
    }

    setIsNetworkModalVisible([
      connectedChain?.matchWithNetworkChain === false && isRequired,
      connectedChain?.name === UNSUPPORTED_CHAIN && isRequired
    ].some(c => c));
  }

  async function validateEthereum() {
    if(window.ethereum) return true;

    updateWeb3Dialog(true)

    return false;
  }

  async function validateChain() {
    if (connectedChain?.matchWithNetworkChain !== false && connectedChain?.name !== UNSUPPORTED_CHAIN)
      return true;

    setIsNetworkModalVisible(true)

    return false;
  }

  async function validateWallet() {
    const sessionWallet = currentUser?.walletAddress;
    const connectedAddress = connectionInfo?.address;

    if (!connectedAddress || !sessionWallet) return false;

    const isSameWallet = AddressValidator.compare(sessionWallet, connectedAddress);

    if (isSameWallet) return true;

    setIsMismatchModalVisible(true);

    return false;
  }

  async function validateDao() {
    if(daoService) return true;

    addError(t("actions.failed"), t("errors.failed-load-dao"));

    return false
  }

  async function validateLoadNetwork() {
    if (query?.network) {
      if (serviceStarting) {
        addWarning(t("actions.warning"), t("warnings.await-load-network"));
        return false;
      }

      if (!serviceStarting && !marketplace?.active) {
        const started = 
          await changeNetwork(marketplace?.active?.chain_id, marketplace?.active?.networkAddress);
        if (!started)
          addError(t("actions.failed"), t("errors.failed-load-network"));
        return started;
      }
    }

    return true;
  }

  async function handleExecute(e) {
    try {
      if (!onClick)
        throw new Error("Missing onClick callback");

      const validations: (() => Promise<boolean>)[] = [
        validateEthereum,
        validateChain,
        validateWallet,
        validateDao,
        validateLoadNetwork
      ];

      for (const validation of validations) {
        const isValidated = await validation();
        
        if (!isValidated)
          throw new Error(validation.name)
      }

      onClick(e);
    } catch (error) {
      console.debug("Contract Button", error);
    }
  }

  useEffect(changeShowNetworkModal, [
    currentUser?.walletAddress,
    connectedChain?.matchWithNetworkChain,
    connectedChain?.id,
    supportedChains,
    loading,
    isRequired
  ]);

  return(
    <>
      <Button
        onClick={handleExecute}
        {...rest}
      >
        {children}
      </Button>

      <WrongNetworkModal 
        show={isNetworkModalVisible}
        onClose={() => onCloseModal('WrongNetworkModal')}
        isRequired={isRequired}
      />
      <WalletMismatchModal
        show={isMismatchModalVisible}
        onClose={() => onCloseModal('WalletMismatchModal')}
      />
    </>
  );
}