import {create} from "zustand";
import {Transaction} from "../../../interfaces/transaction";
import {v4 as uuidv4} from "uuid";

type TransactionStore = {
  list: Transaction[],
  add(entry: Partial<Transaction>): Partial<Transaction>,
  update(entry: Transaction): void,
  remove(entry: Transaction): void,
  clear(): void,
  set(entries: Transaction[]): void,
}

export const transactionStore =
  create<TransactionStore>((set, get) => ({
    list: [],
    add: (entry: Transaction) => {
      const _entry = {...entry, id: uuidv4(), date: +new Date()}
      set(() => /** prepend the entry like [].shift() */
        ({list: [_entry, ...get().list]}))

      return _entry; /** return the added entry so we can updated it later */
    },
    update: (entry: Transaction) =>
      set(() => {
        const index = get().list.findIndex(_entry => _entry.id === entry.id);
        if (index < 0)
          return {list: get().list};
        return {list: get().list.splice(index, 1, entry)}
      }),
    remove: (entry: Transaction) =>
      set(() =>
        ({list: [...get().list.filter(_entry => _entry.id !== entry.id)]})),
    clear: () => set(() => ({list: []})),
    set: (entries: Transaction[]) =>
      set(() => /** sort dates from highest to lowest */
        ({list: entries.sort((a, b) => a.date > b.date ? 0 : 1)}))
  }))