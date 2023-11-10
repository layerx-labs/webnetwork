import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

import { ToastNotification, ToastNotificationType } from "interfaces/toast-notification";

const DEFAULT_DELAY = 10000;
const DEFAULT_TYPE: ToastNotificationType = "primary";

type ToastStore = {
  toasts: ToastNotification[],
  add (toast: ToastNotification): ToastNotification,
  addSuccess (title: string, content: string): ToastNotification,
  addError (title: string, content: string): ToastNotification,
  addWarning (title: string, content: string): ToastNotification,
  addInfo (title: string, content: string): ToastNotification,
  addPrimary (title: string, content: string): ToastNotification,
  addSecondary (title: string, content: string): ToastNotification,
  remove (toast: ToastNotification): void
}

export const useToastStore = create<ToastStore>((set, get) => {
  const add = (toast: ToastNotification) => {
    const entry = {
      type: DEFAULT_TYPE,
      delay: DEFAULT_DELAY,
      ...toast,
      id: uuidv4()
    };
    set(() => ({
      toasts: [entry, ...get().toasts]
    }));
    return entry;
  };

  return {
    toasts: [],
    add: add,
    addSuccess: (title: string, content: string) => add({ title, content, type: "success" }),
    addError: (title: string, content: string) => add({ title, content, type: "danger" }),
    addWarning: (title: string, content: string) => add({ title, content, type: "warning" }),
    addInfo: (title: string, content: string) => add({ title, content, type: "info" }),
    addPrimary: (title: string, content: string) => add({ title, content, type: "primary" }),
    addSecondary: (title: string, content: string) => add({ title, content, type: "secondary" }),
    remove: (toast: ToastNotification) => {
      set(() => ({
        toasts: get().toasts.filter(({id}) => toast.id !== id)
      }));
    }
  }
});

