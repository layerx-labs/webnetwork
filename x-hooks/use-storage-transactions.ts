import {getTransactionsStorageKey} from "helpers/transactions";

import {WinStorage} from "services/win-storage";

import {transactionStore} from "./stores/transaction-list/transaction.store";

export function useStorageTransactions() {
  const {set} = transactionStore();

  function getWalletAndChainFromStorage() {
    const walletAddress = sessionStorage.getItem("currentWallet")?.toLowerCase();
    const chainId = sessionStorage.getItem("currentChainId");

    return {walletAddress, chainId};
  }

  function deleteFromStorage() {
    const {walletAddress, chainId} = getWalletAndChainFromStorage();
    if (!walletAddress || !chainId)
      return;

    const storage =
      new WinStorage(getTransactionsStorageKey(walletAddress, chainId), 0, 'localStorage');
    storage.value = undefined;

    set([]);
  }

  function loadFromStorage() {
    const {walletAddress, chainId} = getWalletAndChainFromStorage();
    if (!walletAddress || !chainId)
      return;

    const storage =
      new WinStorage(getTransactionsStorageKey(walletAddress, chainId), 0, 'localStorage');

    const transactions = JSON.parse(storage.value || "[]");

    set(transactions);
  }

  return {
    loadFromStorage,
    deleteFromStorage
  };
}