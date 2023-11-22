import {createContext, useContext, useEffect, useReducer} from "react";

import {useRouter} from "next/router";
import sanitizeHtml from "sanitize-html";

import { useToastStore } from "x-hooks/stores/toasts/toasts.store";

import {AppState} from "../interfaces/application-state";
import loadApplicationStateReducers from "./reducers";
import {mainReducer} from "./reducers/main";

const appState: AppState = {
  state: {
    Settings: null,
    loading: null,
    currentUser: null,
    currentBounty: null,
    show: {},
  },
  dispatch: () => undefined
};

export const AppStateContext = createContext(appState);

export function AppStateContextProvider({children}) {
  const { query: { authError } } = useRouter();
  const [state, dispatch] = useReducer(mainReducer, appState.state);

  const { addError } = useToastStore();

  function parseError() {
    if (!authError)
      return;

    console.debug(`Error parsing`, authError);
    addError("Auth error", sanitizeHtml(authError, { allowedTags: [], allowedAttributes: {} }));
  }

  useEffect(parseError, [authError])
  useEffect(loadApplicationStateReducers, [])

  return <AppStateContext.Provider value={{state, dispatch: dispatch as unknown as any}}>
    {children}
  </AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context)
    throw new Error(`useAppState not inside AppStateContext`);

  return context;
}