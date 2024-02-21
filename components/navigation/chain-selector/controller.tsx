import { useRouter } from "next/router";
import { useSwitchChain } from "wagmi";

import ChainSelectorView from "components/navigation/chain-selector/view";

import { isOnNetworkPath } from "helpers/network";

import { SupportedChainData } from "interfaces/supported-chain-data";

import useMarketplace from "x-hooks/use-marketplace";

export default function ChainSelector({
  isFilter = false,
  placeholder
}: {
  isFilter?: boolean;
  placeholder?: string;
}) {
  const { switchChainAsync } = useSwitchChain();
  const { query, pathname, asPath, push } = useRouter();

  const { getURLWithNetwork } = useMarketplace();

  const isOnNetwork = isOnNetworkPath(pathname);
  const isWalletPage = asPath?.includes("wallet");
  const isCreateBountyPage = pathname?.includes("create-task");
  const isCreateNetworkPage = pathname?.includes("new-marketplace");
  const isCreateDeliverablePage = pathname?.includes("create-deliverable");
  const isSetupPage = pathname?.includes("setup");
  const shouldMatchChain = isFilter || isWalletPage || isOnNetwork || isCreateBountyPage || 
    isCreateNetworkPage || isCreateDeliverablePage || isSetupPage;

  async function handleNetworkSelected(chain: SupportedChainData) {
    if (!shouldMatchChain) return;

    if (!isOnNetwork) {
      switchChainAsync(chain)
        .catch(() => null);

      return;
    }

    const needsRedirect = ["bounty", "deliverable", "proposal"].includes(pathname.replace("/[network]/", ""));
    const newPath = needsRedirect ? "/" : pathname;
    const newAsPath = `/${query.network}/`;

    push(getURLWithNetwork(newPath, {
      ... needsRedirect ? {} : query
    }), newAsPath);
  }

  return(
    <ChainSelectorView
      isFilter={isFilter}
      onSelect={handleNetworkSelected}
      shouldMatchChain={shouldMatchChain}
      isOnNetwork={isOnNetwork}
      placeholder={placeholder}
    />
  );
}