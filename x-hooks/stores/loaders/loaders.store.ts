import { create } from "zustand";

import { LoadingState } from "interfaces/loading-state";

type LoadersStore = {
  loading: LoadingState | null;
  web3Dialog: boolean;
  missingMetamask: boolean;
  wrongNetworkModal: boolean;
  walletMismatchModal: boolean;
  walletSelectorModal: boolean;
  updateLoading: (loading: LoadingState) => void;
  updateWeb3Dialog: (web3Dialog: boolean) => void;
  updateMissingMetamask: (missingMetamask: boolean) => void;
  updateWrongNetworkModal: (wrongNetworkModal: boolean) => void;
  updateWalletMismatchModal: (walletMismatchModal: boolean) => void;
  updateWalletSelectorModal: (walletMismatchModal: boolean) => void;
};

type Properties = "loading" | "web3Dialog" | "missingMetamask" |
  "wrongNetworkModal" | "walletMismatchModal" | "walletSelectorModal";

const updateState = (property: Properties, value: boolean | LoadingState) =>
  (state: LoadersStore) => ({
    ...state,
    [property]: value,
  });

export const useLoadersStore = create<LoadersStore>((set) => ({
  loading: null,
  web3Dialog: false,
  missingMetamask: false,
  wrongNetworkModal: false,
  walletMismatchModal: false,
  walletSelectorModal: false,
  updateLoading: (loading: LoadingState) => set(updateState("loading", loading)),
  updateWeb3Dialog: (web3Dialog: boolean) => set(updateState("web3Dialog", web3Dialog)),
  updateMissingMetamask: (missingMetamask: boolean) => set(updateState("missingMetamask", missingMetamask)),
  updateWrongNetworkModal: (wrongNetworkModal: boolean) => set(updateState("wrongNetworkModal", wrongNetworkModal)),
  updateWalletMismatchModal: (walletMismatchModal: boolean) =>
    set(updateState("walletMismatchModal", walletMismatchModal)),
  updateWalletSelectorModal: (walletSelectorModal: boolean) =>
    set(updateState("walletSelectorModal", walletSelectorModal)),
}));
