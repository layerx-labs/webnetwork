import { create } from "zustand";

import { SettingsType } from "types/settings";

type SettingsStore = {
  data: SettingsType | null;
  updateSettings: (settings: SettingsType) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  data: null,
  updateSettings: (settings: SettingsType) => {
    set(() => ({
      data: JSON.parse(JSON.stringify(settings || {})),
    }));
  },
}));
