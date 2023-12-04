import { create } from "zustand";

import { SettingsType } from "types/settings";

type SettingsStore = {
  data: SettingsType | null;
  isGetSettingsDatabase: boolean;
  updateSettings: (settings: SettingsType) => void;
  loadSettingsDatabase: () => void
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  data: null,
  isGetSettingsDatabase: false,
  updateSettings: (settings: SettingsType) => {
    set(() => ({
      data: JSON.parse(JSON.stringify(settings || {})),
      isGetSettingsDatabase: false
    }));
  },
  loadSettingsDatabase: () => {
    set(() => ({
      data: get().data,
      isGetSettingsDatabase: true
    }));
  }
}));
