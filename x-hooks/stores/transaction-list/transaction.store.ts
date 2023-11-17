import {v4 as uuidv4} from "uuid";
import {create} from "zustand";

import { saveTransactionsToStorage } from "helpers/transactions";

import { TransactionStatus } from "interfaces/enums/transaction-status";

import {Transaction} from "../../../interfaces/transaction";

type TransactionStore = {
  list: Transaction[],
  isPending: boolean,
  add(entry: Partial<Transaction>): Partial<Transaction>,
  update(entry: Transaction): void,
  remove(entry: Transaction): void,
  clear(): void,
  set(entries: Transaction[]): void,
}

const handleSet = (list: Transaction[]) => {
  saveTransactionsToStorage(list)
  const isPending = list.some(({ status }) => status === TransactionStatus.pending);
  return ({list, isPending})
}

export const transactionStore =
  create<TransactionStore>((set, get) => ({
    list: [],
    isPending: false,
    add: (entry: Transaction) => {
      const _entry = {...entry, id: uuidv4(), status: TransactionStatus.pending, date: +new Date()}
      const newList = [_entry, ...get().list];
      saveTransactionsToStorage(newList);
      set(() => ({
        list: newList,
        isPending: true
      }))

      return _entry; /** return the added entry so we can updated it later */
    },
    update: (entry: Transaction) =>
      set(() => {
        const index = get().list.findIndex(_entry => _entry.id === entry.id);
        index >= 0 && get().list.splice(index, 1, entry)
        return handleSet(get().list);
      }),
    remove: (entry: Transaction) =>
      set(() => handleSet([...get().list.filter(_entry => _entry.id !== entry.id)])),
    clear: () => set(() => ({list: []})),
    set: (entries: Transaction[]) =>
      /** sort dates from highest to lowest */
      set(() => handleSet(entries.sort((a, b) => a.date > b.date ? 0 : 1)))
  }))