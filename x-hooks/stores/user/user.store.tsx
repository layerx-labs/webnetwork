import { create } from "zustand";

import { CurrentUserState } from "interfaces/application-state";

type UserStore = {
  currentUser: CurrentUserState | null;
  updateCurrentUser: (v: Partial<CurrentUserState>) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  updateCurrentUser: (v: Partial<CurrentUserState>) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...v },
    }));
  },
}));
