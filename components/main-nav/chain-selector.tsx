import { useRouter } from "next/router";

import ResponsiveWrapper from "components/responsive-wrapper";
import SelectChainDropdown from "components/select-chain-dropdown";

import { useAppState } from "contexts/app-state";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { useDao } from "x-hooks/use-dao";
import { useNetwork } from "x-hooks/use-network";
import useNetworkChange from "x-hooks/use-network-change";

export default function ChainSelector() {
  const { query, pathname, asPath, push } = useRouter();

  const { connect } = useDao();
  const { state } = useAppState();
  const { getURLWithNetwork } = useNetwork();
  const { handleAddNetwork } = useNetworkChange();
  
  const isOnNetwork = pathname?.includes("[network]");

  async function handleNetworkSelected(chain: SupportedChainData) {
    if (!isOnNetwork) {
      handleAddNetwork(chain)
        .then(() => {
          if (state.currentUser?.walletAddress) return;

          connect();
        })
        .catch(() => null);

      return;
    }

    const needsRedirect = ["bounty", "pull-request", "proposal"].includes(pathname.replace("/[network]/[chain]/", ""));
    const newPath = needsRedirect ? "/" : pathname;
    const newAsPath = needsRedirect ? `/${query.network}/${chain.chainShortName}` :
      asPath.replace(query.chain.toString(), chain.chainShortName);

    push(getURLWithNetwork(newPath, {
      ... needsRedirect ? {} : query,
      chain: chain.chainShortName
    }), newAsPath);
  }

  if (!isOnNetwork) return <></>;

  return(
    <SelectChainDropdown
      onSelect={(chain) => handleNetworkSelected(chain)}
      isOnNetwork={isOnNetwork}
      className="select-network-dropdown"
    />
  );
}