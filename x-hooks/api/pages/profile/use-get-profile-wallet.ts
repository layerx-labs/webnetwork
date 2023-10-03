import { useGetChains } from "x-hooks/api/chain";
import { useGetTokens } from "x-hooks/api/token";

export async function useGetProfileWallet() {
  const [tokens, chains] = await Promise.all([
    useGetTokens()
      .catch(() => null),
    useGetChains(),
  ]);

  return {
    tokens,
    chains
  }
}