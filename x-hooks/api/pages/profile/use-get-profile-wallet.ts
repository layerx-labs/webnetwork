import { useGetChains } from "x-hooks/api/chain";

export async function useGetProfileWallet() {
  const chains = await useGetChains()

  return {
    chains
  }
}