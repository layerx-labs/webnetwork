import BigNumber from "bignumber.js";

import { ProposalDisputesView } from "components/proposal/disputes-list/view";

import { ProposalDisputes } from "interfaces/proposal";

import useMarketplace from "x-hooks/use-marketplace";
import { useSettings } from "x-hooks/use-settings";

interface ProposalDisputesProps {
  disputes: ProposalDisputes[];
  networkTokenSymbol: string;
}

export function ProposalDisputes({ 
  disputes,
  networkTokenSymbol,
}: ProposalDisputesProps) {
  const { settings } = useSettings();
  const { getTotalNetworkToken } = useMarketplace();
  const { data: totalNetworkToken } = getTotalNetworkToken();

  function percentage(value: string) {
    if (!totalNetworkToken) return "0";

    return BigNumber(value)
      .dividedBy(totalNetworkToken)
      .multipliedBy(100)
      .toFixed(2);
  }

  return (
    <ProposalDisputesView
      disputes={disputes}
      networkTokenSymbol={networkTokenSymbol}
      defaultFiat={settings?.currency?.defaultFiat}
      calculatePercentage={percentage}
    />
  );
}
