import { useTranslation } from "next-i18next";

import ProposalActionsView from "components/proposal/actions/view";

import {
  IssueBigNumberData,
  IssueData,
} from "interfaces/issue-data";
import { DistributedAmounts, Proposal } from "interfaces/proposal";

import useMarketplace from "x-hooks/use-marketplace";

interface ProposalActionsProps {
  proposal: Proposal;
  issue: IssueData | IssueBigNumberData;
  distributedAmounts: DistributedAmounts;
  isUserAbleToDispute: boolean;
  isDisputableOnChain: boolean;
  missingDisputableTime: string;
  isDisputable: boolean;
  isRefusable: boolean;
  isMergeable: boolean;
}

export default function ProposalActions({
  proposal,
  issue,
  distributedAmounts,
  isUserAbleToDispute,
  isDisputableOnChain,
  missingDisputableTime,
  isDisputable,
  isRefusable,
  isMergeable
}: ProposalActionsProps) {
  const { t } = useTranslation(["common", "deliverable", "proposal"]);

  const marketplace = useMarketplace();

  const warnings = [
    isDisputableOnChain && t("proposal:messages.in-disputable-time", {
      time: missingDisputableTime,
    })
  ].filter(warning => warning);

  return (
    <ProposalActionsView
      proposal={proposal}
      issue={issue}
      distributedAmounts={distributedAmounts}
      percentageNeededForDispute={
        +marketplace?.active?.percentageNeededForDispute
      }
      warnings={warnings}
      isUserAbleToDispute={isUserAbleToDispute}
      isDisputable={isDisputable}
      isRefusable={isRefusable}
      isMergeable={isMergeable}
    />
  );
}
