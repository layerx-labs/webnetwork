import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import Button, { ButtonProps } from "components/button";

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

  const { query } = useRouter();
  const { changeNetwork } = useDao();
  const marketplace = useMarketplace();
  const { currentUser } = useUserStore();
  const { connectedChain } = useSupportedChain();
  const { addError, addWarning } = useToastStore();
  const { service: daoService, serviceStarting } = useDaoStore();
  const { updateWeb3Dialog, updateWrongNetworkModal, updateWalletMismatchModal } = useLoadersStore();

  const connectionInfo = useDappkitConnectionInfo();

  async function validateEthereum() {
    if(window.ethereum) return true;

    updateWeb3Dialog(true)

    return false;
  }

  async function validateChain() {
    if (connectedChain?.matchWithNetworkChain !== false && connectedChain?.name !== UNSUPPORTED_CHAIN)
      return true;

    updateWrongNetworkModal(true)

    return false;
  }

  async function validateWallet() {
    const sessionWallet = currentUser?.walletAddress;
    const connectedAddress = connectionInfo?.address;

    if (!connectedAddress || !sessionWallet) return false;

    const isSameWallet = AddressValidator.compare(sessionWallet, connectedAddress);

    if (isSameWallet) return true;

    updateWalletMismatchModal(true);

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

  return(
    <>
      <Button
        onClick={handleExecute}
        {...rest}
      >
        {children}
      </Button>
    </>
  );
}