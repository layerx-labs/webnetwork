import { create } from "zustand";

import DAO from "services/dao-service";

type DaoServiceStore = {
  service: DAO | null;
  updateService: (dao: DAO) => void;
};

export const useDaoService = create<DaoServiceStore>((set) => ({
  service: null,
  updateService: (dao: DAO) => {
    set(() => ({
      service: dao,
    }));
  },
}));
