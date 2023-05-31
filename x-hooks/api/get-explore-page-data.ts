import { api } from "services/api";

export default async function getExplorePageData(query) {
  const { network } = query;

  const { data } = await api.get("/search/networks/total", { 
    params: {
      name: network
    }
  });

  return {
    numberOfNetworks: data
  };
}