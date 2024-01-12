import { Web3Connection } from "@taikai/dappkit";
import { useDappkit } from "dappkit-react";

import decodeMessage from "helpers/decode-message";
import {messageFor} from "helpers/message-for";

import { ethereumMessageService } from "services/ethereum/message";
import { siweMessageService } from "services/ethereum/siwe";

import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";

export default function useSignature() {
  const { connection, chainId } = useDappkit();

  const { addError } = useToastStore();
  const { currentUser } = useUserStore();

  async function signMessage(message = ""): Promise<string> {
    if ((!connection && !window.ethereum) || !currentUser?.walletAddress)
      return;

    const typedMessage = ethereumMessageService.getMessage({
      chainId: chainId?.toString(),
      message
    });

    return ethereumMessageService.sendMessage(connection, currentUser.walletAddress, typedMessage)
      .catch(error => {
        console.debug("Failed to sign message", error?.toString());
        addError("Failed", "Signed message required to proceed");
        return null;
      });
  }

  async function signInWithEthereum(nonce: string,
                                    address: string,
                                    issuedAt: Date,
                                    expiresAt: Date,
                                    web3Connection?: Web3Connection) {
    const actualConnection = web3Connection || connection;
    if ((!actualConnection && !window.ethereum) || !nonce || !address)
      return;

    const message = siweMessageService.getMessage({
      nonce,
      issuedAt,
      expiresAt,
    });

    return siweMessageService
      .sendMessage(actualConnection, address, message)
      .catch(() => null);
  }

  return {
    signMessage,
    messageFor,
    decodeMessage,
    signInWithEthereum,
  }
}