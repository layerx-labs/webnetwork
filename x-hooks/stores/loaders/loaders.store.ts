import { create } from "zustand";

import { LoadingState } from "interfaces/loading-state";

type LoadersStore = {
  loading: LoadingState | null;
  wrongNetworkModal: boolean;
  walletMismatchModal: boolean;
  waitingForMessageSign: boolean;
  updateLoading: (loading: LoadingState) => void;
  updateWrongNetworkModal: (wrongNetworkModal: boolean) => void;
  updateWalletMismatchModal: (walletMismatchModal: boolean) => void;
  updateWaitingForMessageSign: (waitingForMessageSign: boolean) => void;
};

type Properties = "loading" | "wrongNetworkModal" | "walletMismatchModal" | "waitingForMessageSign";

const updateState = (property: Properties, value: boolean | LoadingState) =>
  (state: LoadersStore) => ({
    ...state,
    [property]: value,
  });

export const useLoadersStore = create<LoadersStore>((set) => ({
  loading: null,
  wrongNetworkModal: false,
  walletMismatchModal: false,
  walletSelectorModal: false,
  waitingForMessageSign: false,
  updateLoading: (loading: LoadingState) => set(updateState("loading", loading)),
  updateWrongNetworkModal: (wrongNetworkModal: boolean) => set(updateState("wrongNetworkModal", wrongNetworkModal)),
  updateWalletMismatchModal: (walletMismatchModal: boolean) =>
    set(updateState("walletMismatchModal", walletMismatchModal)),
  updateWaitingForMessageSign: (waitingForMessageSign: boolean) =>
    set(updateState("waitingForMessageSign", waitingForMessageSign)),
}));
