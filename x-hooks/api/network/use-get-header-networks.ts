import BigNumber from "bignumber.js";

import { HeaderNetworksProps } from "interfaces/header-information";

import { api } from "services/api";

export async function useGetHeaderNetworks() {
  return api
    .get<HeaderNetworksProps>(`/header/networks`)
    .then(({ data }) => ({
      ...data,
      TVL: BigNumber(data.TVL)
    }))
    .catch((error) => {
      throw error;
    });
}