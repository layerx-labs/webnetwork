import { create } from "zustand";

import { CurrentBounty } from "interfaces/application-state";

type TaskStore = {
  data: CurrentBounty | null;
  updateTask: (v: Partial<CurrentBounty>) => void;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
    data: null,
    updateTask: (v: Partial<CurrentBounty>) => {
      set(() => ({
        data: { ...get().data, ...v }
      }))
    },
}));
