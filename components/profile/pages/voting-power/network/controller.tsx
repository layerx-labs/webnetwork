import {useState} from "react";

import BigNumber from "bignumber.js";

import VotingPowerNetworkView from "components/profile/pages/voting-power/network/view";

import {useUserStore} from "x-hooks/stores/user/user.store";

import {FIVE_MINUTES_IN_MS} from "helpers/constants";
import {QueryKeys} from "helpers/query-keys";
import {lowerCaseCompare} from "helpers/string";

import {Network} from "interfaces/network";
import {SupportedChainData} from "interfaces/supported-chain-data";

import {useSearchCurators} from "x-hooks/api/curator";
import {useDaoStore} from "x-hooks/stores/dao/dao.store";
import useReactQuery from "x-hooks/use-react-query";
import useSupportedChain from "x-hooks/use-supported-chain";

export default function VotingPowerNetwork() {
  const [network, setNetwork] = useState<Network>();
  const [chain, setChain] = useState<SupportedChainData>();

  const { currentUser } = useUserStore();
  const { chainId, networkAddress } = useDaoStore();
  const { supportedChains } = useSupportedChain();

  const address = currentUser?.walletAddress;
  const chainShortName = chain?.chainShortName;
  const networkName = network?.name;
  const isActionsEnabled = !!network && !!chain && +chain?.chainId === +chainId
    && lowerCaseCompare(networkAddress, network?.networkAddress);

  const { data: curators } =
    useReactQuery(QueryKeys.votingPowerOf(address, chainShortName, networkName), () => useSearchCurators({
      address: address,
      networkName: networkName,
      chainShortName: chainShortName,
      increaseQuantity: true,
    }), {
      enabled: !!address,
      staleTime: FIVE_MINUTES_IN_MS
    });

  const { locked, delegatedToMe, delegations } = (curators?.rows || []).reduce((acc, curr) => {
    return {
      locked: [...acc.locked, ...BigNumber(curr.tokensLocked).gt(0) ? [curr] : []],
      delegatedToMe: [...acc.delegatedToMe, ...BigNumber(curr.delegatedToMe).gt(0) ? [curr] : []],
      delegations: [...acc.delegations, ...curr.delegations?.length ? [curr] : []],
    }
  }, { locked: [], delegatedToMe: [], delegations: [] });

  return (
    <VotingPowerNetworkView
      chains={supportedChains}
      networks={chain?.networks}
      locked={locked}
      delegatedToMe={delegatedToMe}
      delegations={delegations}
    />
  );
}
