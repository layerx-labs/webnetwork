import { create } from "zustand";

import DAO from "services/dao-service";

type DaoServiceStore = {
  service: DAO | null;
  chainId: number | null;
  registryAddress: string | null;
  networkAddress: string | null;
  serviceStarting: boolean;
  get: () => DaoServiceStore,
  updateServiceStarting: (v: boolean) => void;
  updateService: (dao: DAO, chainId?: number, registryAddress?: string, networkAddress?: string) => void;
};

export const useDaoStore = create<DaoServiceStore>((set, get) => ({
  service: null,
  serviceStarting: false,
  chainId: null,
  registryAddress: null,
  networkAddress: null,
  get,
  updateServiceStarting: (v: boolean) => {
    set(() => ({
      service: get().service,
      serviceStarting: v
    }))
  },
  updateService: (dao: DAO, chainId?: number, registryAddress?: string, networkAddress?: string) => {
    set(() => ({
      service: dao,
      chainId,
      registryAddress,
      networkAddress,
      serviceStarting: false
    }));
  },
}));
