import { api } from "services/api";

interface payloadProps {
  networkId: number;
}

export default async function useUpdateCouncilAmountChange({ networkId }: payloadProps) {
  return api
    .get(`/network/update/council/${networkId}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
}
