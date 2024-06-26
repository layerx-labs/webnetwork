import { HeaderNetworksProps } from "interfaces/header-information";

import { api } from "services/api";

export async function useGetHeaderNetworks() {
  return api
    .get<HeaderNetworksProps>(`/header/marketplaces`)
    .then(({ data }) => ({
      totalConverted: data.TVL || 0,
      numberOfBounties: data.bounties || 0,
      numberOfNetworks: data.number_of_network || 0,
    }))
    .catch((error) => {
      console.debug("Failed got header networks", error.toString());
      return {
        totalConverted: 0,
        numberOfBounties: 0,
        numberOfNetworks: 0,
      };
    });
}