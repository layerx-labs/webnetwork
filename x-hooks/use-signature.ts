import {useAppState} from "contexts/app-state";

import decodeMessage from "helpers/decode-message";
import {messageFor} from "helpers/message-for";

import { ethereumMessageService } from "services/ethereum/message";
import { siweMessageService } from "services/ethereum/siwe";

import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useDappkitConnection } from "x-hooks/use-dappkit";

import useSupportedChain from "./use-supported-chain";

export default function useSignature() {
  const {state: { currentUser }} = useAppState();
  const { connectedChain } = useSupportedChain();
  const { addError } = useToastStore();
  const { connection } = useDappkitConnection();

  async function signMessage(message = ""): Promise<string> {
    if ((!connection && !window.ethereum) || !currentUser?.walletAddress)
      return;

    const typedMessage = ethereumMessageService.getMessage({
      chainId: connectedChain?.id,
      message
    });

    return ethereumMessageService.sendMessage(connection, currentUser.walletAddress, typedMessage)
      .catch(error => {
        console.debug("Failed to sign message", error?.toString());
        addError("Failed", "Signed message required to proceed");
        return null;
      });
  }

  async function signInWithEthereum(nonce: string, address: string, issuedAt: Date, expiresAt: Date) {
    if ((!connection && !window.ethereum) || !nonce || !address)
      return;

    const message = siweMessageService.getMessage({
      nonce,
      issuedAt,
      expiresAt
    });

    const signature = await siweMessageService.sendMessage(connection, address, message)
      .catch(() => null);

    return signature;
  }

  return {
    signMessage,
    messageFor,
    decodeMessage,
    signInWithEthereum,
  }
}