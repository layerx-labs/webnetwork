import { useState } from "react";

import { MINUTE_IN_MS } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import { WinStorage } from "../services/win-storage";
import { useGetSettings } from "./api/use-get-settings";
import { useSettingsStore } from "./stores/settings/settings.store";
import useReactQuery from "./use-react-query";

/**
 * Loads settings with useEffect if not loaded previously
 */
export function useSettings() {
  const {
    data: settings,
    updateSettings,
    loadSettingsDatabase,
    isGetSettingsDatabase,
  } = useSettingsStore();

  const [storage] = useState<WinStorage>(new WinStorage("web-network.settings", 3600 * 1000, "sessionStorage"));

  const { invalidate } = useReactQuery(QueryKeys.settings(),
                                       () =>
      useGetSettings()
        .then((settings) => {
          storage.value = settings;
          // setTmpSettings(settings)
          updateSettings(settings);
          return settings;
        })
        .catch((e) => {
          console.error(`Failed to load settings from db`, e);
          updateSettings(null);
          return null;
        }),
                                       {
      staleTime: MINUTE_IN_MS,
      enabled: isGetSettingsDatabase,
                                       });

  /**
   * Load settings on useSettings() start only if `Settings` is empty
   * Reload settings on each session start
   */
  function loadSettings(force?: boolean) {
    if (settings && !force) return;

    if (storage.value && !force) {
      updateSettings(storage.value);
      // return storage.value;
      return;
    }

    updateSettings(null);
    loadSettingsDatabase();
  }

  return {
    settings,
    refresh: invalidate,
    loadSettings,
  };
}
