import { create } from "zustand";

import { LoadingState } from "interfaces/loading-state";

type LoadersStore = {
  loading: LoadingState | null;
  web3Dialog: boolean;
  missingMetamask: boolean;
  reAuthorizeGithub: boolean;
  updateLoading: (loading: LoadingState) => void;
  updateWeb3Dialog: (web3Dialog: boolean) => void;
  updateMissingMetamask: (missingMetamask: boolean) => void;
  updateReAuthorizeGithub: (reAuthorizeGithub: boolean) => void;
};

const updateState =
  (property: string, value: boolean | LoadingState) => (state: LoadersStore) => ({
    ...state,
    [property]: value,
  });

export const useLoadersStore = create<LoadersStore>((set) => ({
  loading: null,
  web3Dialog: false,
  missingMetamask: false,
  reAuthorizeGithub: false,
  updateLoading: (loading: LoadingState) => set(updateState('loading', loading)),
  updateWeb3Dialog: (web3Dialog: boolean) => set(updateState('web3Dialog', web3Dialog)),
  updateMissingMetamask: (missingMetamask: boolean) => set(updateState('missingMetamask', missingMetamask)),
  updateReAuthorizeGithub: (reAuthorizeGithub: boolean) => set(updateState('reAuthorizeGithub', reAuthorizeGithub)),
}));
