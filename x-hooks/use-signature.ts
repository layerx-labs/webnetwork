import {useAppState} from "contexts/app-state";

import decodeMessage from "helpers/decode-message";
import {messageFor} from "helpers/message-for";

import { ethereumMessageService } from "services/ethereum/message";
import { siweMessageService } from "services/ethereum/siwe";

import { useToastStore } from "x-hooks/stores/toasts/toasts.store";

export default function useSignature() {
  const {
    state: {
      connectedChain, 
      Service, 
      currentUser
    }
  } = useAppState();
  const { addError } = useToastStore();

  async function signMessage(message = ""): Promise<string> {
    if ((!Service?.web3Connection && !window.ethereum) || !currentUser?.walletAddress)
      return;

    const typedMessage = ethereumMessageService.getMessage({
      chainId: connectedChain?.id,
      message
    });

    return ethereumMessageService.sendMessage(Service?.web3Connection, currentUser.walletAddress, typedMessage)
      .catch(error => {
        console.debug("Failed to sign message", error?.toString());
        addError("Failed", "Signed message required to proceed");
        return null;
      });
  }

  async function signInWithEthereum(nonce: string, address: string, issuedAt: Date, expiresAt: Date) {
    if ((!Service?.web3Connection && !window.ethereum) || !nonce || !address)
      return;

    const message = siweMessageService.getMessage({
      nonce,
      issuedAt,
      expiresAt
    });

    const signature = await siweMessageService.sendMessage(Service.web3Connection, address, message)
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