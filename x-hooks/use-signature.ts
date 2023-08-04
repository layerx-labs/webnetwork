import { eip4361Params, TypedDataV4, jsonRpcParams } from "@taikai/dappkit";
import getConfig from "next/config";

import {useAppState} from "contexts/app-state";
import { addToast } from "contexts/reducers/change-toaster";

import decodeMessage from "helpers/decode-message";
import {messageFor} from "helpers/message-for";

const { publicRuntimeConfig } = getConfig();

export default function useSignature() {

  const {
    dispatch, 
    state: {
      connectedChain, 
      Service, 
      currentUser
    }
  } = useAppState();

  async function sendTypedData(message: TypedDataV4, from: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const callback = (error: Error|null, value: any|null) => error ? reject(error) : resolve(value?.result);
      
      try {
        Service?.web3Connection?.Web3.currentProvider
          .send(jsonRpcParams(`eth_signTypedData_v4`, [from, JSON.stringify(message)]), callback);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function signMessage(message = ""): Promise<string> {
    if ((!Service?.active && !window.ethereum) || !currentUser?.walletAddress)
      return;

    const payload = {
      method: `eth_signTypedData_v4`,
      from: currentUser.walletAddress,
      params: [
        currentUser.walletAddress, messageFor(connectedChain?.id, message)
      ]
    }

    return new Promise((res, rej) => {
      const _promise = (err, d) => { 
        if (!err)
          return res(d?.result);
        
        console.debug("Failed to sign message", err);

        dispatch(addToast({
          type: "danger",
          title: "Failed",
          content: "Signed message required to proceed",
        }));

        return res(undefined);
      };

      if (Service.active?.web3Connection?.Web3?.currentProvider?.hasOwnProperty("sendAsync"))
        Service.active?.web3Connection.Web3.currentProvider.sendAsync(payload, _promise);
      else if (window.ethereum) 
        window.ethereum.request(payload).then(v => _promise(null, {result: v})).catch(e => _promise(e, null));
    });
  }

  async function signWithEthereumMessage(nonce: string, wallet: string) {
    if ((!Service?.web3Connection && !window.ethereum) || !nonce || !wallet)
      return;

    const message = eip4361Params(publicRuntimeConfig?.urls?.home,
                                  "",
                                  "Sign in with Ethereum",
                                  publicRuntimeConfig?.urls?.home,
                                  "1.0",
                                  "",
                                  nonce,
                                  new Date().toISOString(),
                                  new Date(+new Date() + 3600 * 60).toISOString(),
                                  new Date(+new Date() + 60 * 60).toISOString(),
                                  "",
                                  [],
                                  "Bepro Network");

    const signature = await sendTypedData(message, wallet)
      .catch(() => null);

    return {
      signature,
      message
    };
  }

  return {
    signMessage,
    messageFor,
    decodeMessage,
    signWithEthereumMessage,
  }
}