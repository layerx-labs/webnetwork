import BigNumber from "bignumber.js";

import { ProposalDisputesView } from "components/proposal/disputes-list/view";

import { useAppState } from "contexts/app-state";

import { ProposalDisputes } from "interfaces/proposal";

interface ProposalDisputesProps {
  disputes: ProposalDisputes[];
  networkTokenSymbol: string;
}

export function ProposalDisputes({ 
  disputes,
  networkTokenSymbol,
}: ProposalDisputesProps) {
  const { state } = useAppState();

  function percentage(value: string) {
    return BigNumber(value)
      .dividedBy(state.currentUser?.balance?.staked?.toNumber())
      .multipliedBy(100)
      .toFixed(2);
  }

  return (
    <ProposalDisputesView
      disputes={disputes}
      networkTokenSymbol={networkTokenSymbol}
      defaultFiat={state.Settings?.currency?.defaultFiat}
      calculatePercentage={percentage}
    />
  );
}
