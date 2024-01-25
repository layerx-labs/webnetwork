import { Web3Connection } from "@taikai/dappkit";

import { WalletProviders } from "interfaces/enums/wallet-providers";

export function getProviderNameFromConnection (connection: Web3Connection) {
  const selectedProvider = connection?.web3?.givenProvider?.selectedProvider;
  const provider = selectedProvider ? selectedProvider : connection?.web3?.givenProvider;
  if (provider?.isCoinbaseWallet)
    return WalletProviders.CoinBase;
  if (provider?.isMetaMask)
    return WalletProviders.MetaMask;
  return WalletProviders.Unsupported;
}