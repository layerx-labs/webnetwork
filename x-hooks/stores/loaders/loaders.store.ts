import { create } from "zustand";

import { LoadingState } from "interfaces/loading-state";

type NotificationReasons = "task-subscription" | null;

type LoadersStore = {
  loading: LoadingState | null;
  wrongNetworkModal: boolean;
  walletMismatchModal: boolean;
  waitingForMessageSign: boolean;
  turnOnNotificationsModalReason: NotificationReasons,
  updateLoading: (loading: LoadingState) => void;
  updateWrongNetworkModal: (wrongNetworkModal: boolean) => void;
  updateWalletMismatchModal: (walletMismatchModal: boolean) => void;
  updateWaitingForMessageSign: (waitingForMessageSign: boolean) => void;
  updateTurnOnNotificationsModalReason: (reason: string) => void;
};

type Properties = 
  "loading" | "wrongNetworkModal" | "walletMismatchModal" | "waitingForMessageSign" | "turnOnNotificationsModalReason";

const updateState = (property: Properties, value: string | boolean | LoadingState) =>
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
  turnOnNotificationsModalReason: null,
  updateLoading: (loading: LoadingState) => set(updateState("loading", loading)),
  updateWrongNetworkModal: (wrongNetworkModal: boolean) => set(updateState("wrongNetworkModal", wrongNetworkModal)),
  updateWalletMismatchModal: (walletMismatchModal: boolean) =>
    set(updateState("walletMismatchModal", walletMismatchModal)),
  updateWaitingForMessageSign: (waitingForMessageSign: boolean) =>
    set(updateState("waitingForMessageSign", waitingForMessageSign)),
  updateTurnOnNotificationsModalReason: (reason: string) => set(updateState("turnOnNotificationsModalReason", reason)),
}));
