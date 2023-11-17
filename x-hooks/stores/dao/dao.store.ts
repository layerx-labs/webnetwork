import { create } from "zustand";

import DAO from "services/dao-service";

type DaoServiceStore = {
  service: DAO | null;
  serviceStarting: boolean;
  updateServiceStarting: (v: boolean) => void;
  updateService: (dao: DAO) => void;
};

export const useDaoStore = create<DaoServiceStore>((set, get) => ({
  service: null,
  serviceStarting: false,
  updateServiceStarting: (v: boolean) => {
    set(() => ({
      service: get().service,
      serviceStarting: v
    }))
  },
  updateService: (dao: DAO) => {
    set(() => ({
      service: dao,
      serviceStarting: false
    }));
  },
}));
