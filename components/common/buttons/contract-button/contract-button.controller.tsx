import React, { useState } from "react";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTranslation } from "next-i18next";
import { parseCookies } from "nookies";
import { useAccount, useConnectors } from "wagmi";

import { ButtonProps } from "components/button";
import ContractButtonView from "components/common/buttons/contract-button/contract-button.view";

import { UNSUPPORTED_CHAIN } from "helpers/constants";
import { lowerCaseCompare } from "helpers/string";
import { AddressValidator } from "helpers/validators/address";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useDao } from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

export interface ContractButtonProps extends ButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  variant?: "network" | "registry";
}
export default function ContractButton({
  onClick,
  children,
  variant = "network",
  ...rest
}: ContractButtonProps) {
  const { t } = useTranslation(["common"]);
  const cookies = parseCookies();
  const connectors = useConnectors();
  const { openConnectModal } = useConnectModal();
  const { address: connectedAddress, chainId } = useAccount();

  const [isValidating, setIsValidating] = useState(false);

  const marketplace = useMarketplace();
  const { connectedChain } = useSupportedChain();
  const { start, connect, disconnect } = useDao();

  const { addError } = useToastStore();
  const { currentUser } = useUserStore();
  const { updateWrongNetworkModal, updateWalletMismatchModal } = useLoadersStore();

  const isSameChain = !!chainId && !!marketplace?.active?.chain_id &&
    +chainId === +marketplace?.active?.chain_id;
  const isNetworkVariant = variant === "network";
  const isUnsupportedChain = connectedChain?.name === UNSUPPORTED_CHAIN;
  const recentConnectorId = cookies ? cookies["wagmi.recentConnectorId"]?.toLowerCase()?.replace("\"", "")  : null;
  const isLastProviderInjected = connectors?.find(c => lowerCaseCompare(c.id, recentConnectorId))?.type === "injected";

  async function validateChain() {
    if ((isNetworkVariant && isSameChain || !isNetworkVariant) && !isUnsupportedChain)
      return true;

    updateWrongNetworkModal(true)

    return false;
  }

  async function validateWallet() {
    const sessionWallet = currentUser?.walletAddress;

    if (!sessionWallet) return false;

    let address = connectedAddress?.toString();
    if (!address) {
      if (isLastProviderInjected) {
        address = await connect();
        if (!address)
          return false;
      } else {
        await disconnect();
        openConnectModal();
        return false;
      }
    }

    const isSameWallet = AddressValidator.compare(sessionWallet, address);

    if (isSameWallet) return true;

    updateWalletMismatchModal(true);

    return false;
  }

  async function validateService() {
    try {
      await start({
        chainId: +(isNetworkVariant ? marketplace?.active?.chain_id : chainId),
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

      setIsValidating(true);

      const validations: (() => Promise<boolean>)[] = [
        validateWallet,
        validateChain,
        validateService,
      ];

      for (const validation of validations) {
        const isValidated = await validation();

        if (!isValidated)
          throw new Error(validation.name)
      }

      await onClick?.(e);
    } catch (error) {
      console.debug("Contract Button", error);
    } finally {
      setIsValidating(false);
    }
  }

  return(
    <ContractButtonView
      onClick={handleExecute}
      {...rest}
      isLoading={isValidating || rest?.isLoading}
      disabled={isValidating || rest?.disabled}
    >
      {children}
    </ContractButtonView>
  );
}