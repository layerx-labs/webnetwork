import { create } from "zustand";

import { CurrentUserState } from "interfaces/application-state";

type UserStore = {
  currentUser: CurrentUserState | null;
  updateCurrentUser: (v: Partial<CurrentUserState>) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  updateCurrentUser: (v: Partial<CurrentUserState>) => {
    set((state) => {
      // Checks if the properties of v are different from the current properties
      if (
        state.currentUser &&
        Object.keys(v).some((key) => state.currentUser[key] !== v[key])
      ) {
        return {
          currentUser: { ...state.currentUser, ...v },
        };
      }
      return state;
    });
  },
}));
