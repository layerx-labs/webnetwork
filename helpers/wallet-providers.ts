import { Web3Connection } from "@taikai/dappkit";

import { WalletProviders } from "interfaces/enums/wallet-providers";

export function getProviderNameFromConnection (connection: Web3Connection) {
  const selectedProvider = connection?.web3?.currentProvider?.selectedProvider;
  if (selectedProvider?.isCoinbaseWallet)
    return WalletProviders.CoinBase;
  else if (selectedProvider?.isMetamask)
    return WalletProviders.MetaMask;
  return WalletProviders.Unsupported;
}