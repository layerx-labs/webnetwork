import { Web3Connection } from "@taikai/dappkit";

import { WalletProviders } from "interfaces/enums/wallet-providers";

export function getProviderNameFromConnection (connection: Web3Connection) {
  const currentProvider = connection?.web3?.currentProvider;
  if (currentProvider?.isCoinbaseWallet)
    return WalletProviders.CoinBase;
  else if (currentProvider?.isMetaMask)
    return WalletProviders.MetaMask;
  return WalletProviders.Unsupported;
}