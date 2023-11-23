import { useState } from "react";

import { WinStorage } from "../services/win-storage";
import { useGetSettings } from "./api/use-get-settings";
import { useSettingsStore } from "./stores/settings/settings.store";

/**
 * Loads settings with useEffect if not loaded previously
 */
export function useSettings() {
  const { data: Settings, updateSettings } = useSettingsStore();

  const [storage] = useState<WinStorage>(new WinStorage("web-network.settings", 3600 * 1000, "sessionStorage"));

  /**
   * Load settings on useSettings() start only if `Settings` is empty
   * Reload settings on each session start
   */
  function loadSettings(force?: boolean) {
    if (Settings && !force) return;

    if (storage.value && !force) {
      updateSettings(storage.value);
      // return storage.value;
      return;
    }

    updateSettings(null);
    useGetSettings()
      .then((settings) => {
        storage.value = settings;
        // setTmpSettings(settings)
        updateSettings(settings);
        // return settings;
      })
      .catch((e) => {
        console.error(`Failed to load settings from db`, e);
      });
  }

  return {
    loadSettings,
  };
}
