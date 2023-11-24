import { useTranslation } from "next-i18next";

import Button, { ButtonProps } from "components/button";

import { UNSUPPORTED_CHAIN } from "helpers/constants";
import { AddressValidator } from "helpers/validators/address";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useDao } from "x-hooks/use-dao";
import { useDappkitConnectionInfo } from "x-hooks/use-dappkit";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

interface ContractButtonProps extends ButtonProps {
  variant?: "network" | "registry";
}
export default function ContractButton({
  onClick,
  children,
  variant = "network",
  ...rest
}: ContractButtonProps) {
  const { t } = useTranslation(["common"]);

  const { start } = useDao();
  const marketplace = useMarketplace();
  const { currentUser } = useUserStore();
  const { connectedChain } = useSupportedChain();
  const { addError } = useToastStore();
  const { updateWeb3Dialog, updateWrongNetworkModal, updateWalletMismatchModal } = useLoadersStore();

  const connectionInfo = useDappkitConnectionInfo();
  const isSameChain = !!connectedChain?.id && !!marketplace?.active?.chain_id &&
    +connectedChain?.id === +marketplace?.active?.chain_id;
  const isNetworkVariant = variant === "network";

  async function validateEthereum() {
    if(window.ethereum) return true;

    updateWeb3Dialog(true)

    return false;
  }

  async function validateChain() {
    if (isSameChain && connectedChain?.name !== UNSUPPORTED_CHAIN)
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

  async function validateService() {
    try {
      await start({
        chainId: +(isNetworkVariant ? marketplace?.active?.chain_id : connectedChain?.id),
        networkAddress: isNetworkVariant ? marketplace?.active?.networkAddress : null,
      });
      return true;
    } catch (e) {
      addError(t("actions.failed"), t("errors.failed-load-dao"));
      return false;
    }
  }

  async function handleExecute(e) {
    try {
      if (!onClick)
        throw new Error("Missing onClick callback");

      const validations: (() => Promise<boolean>)[] = [
        validateEthereum,
        validateChain,
        validateWallet,
        validateService
      ];

      for (const validation of validations) {
        const isValidated = await validation();
        
        if (!isValidated)
          throw new Error(validation.name)
      }

      onClick?.(e);
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