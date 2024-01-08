import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

import { CustomSession } from "interfaces/custom-session";
import { NetworkEvents } from "interfaces/enums/events";
import { IssueBigNumberData, IssueData } from "interfaces/issue-data";
import { DistributedAmounts, Proposal } from "interfaces/proposal";

import { UserRoleUtils } from "server/utils/jwt";

import { useCreateNft } from "x-hooks/api/nft";
import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";
import useRefresh from "x-hooks/use-refresh";

import ProposalActionsButtonsView from "./view";


interface ProposalActionsButtonsProps {
  issue: IssueData | IssueBigNumberData;
  proposal: Proposal;
  onlyMerge?: boolean;
  distributedAmounts: DistributedAmounts;
  isUserAbleToDispute: boolean;
  isRefusable: boolean;
  isDisputable: boolean;
  isMergeable: boolean;
}

export default function ProposalActionsButtons ({
  issue,
  proposal,
  onlyMerge,
  distributedAmounts,
  isUserAbleToDispute,
  isRefusable,
  isDisputable,
  isMergeable,
}: ProposalActionsButtonsProps) {
  const session = useSession();
  const { t } = useTranslation(["common", "proposal"]);

  const [canCloseTask, setCanCloseTask] = useState(true);

  const { refresh } = useRefresh();
  const { handlerDisputeProposal, handleCloseIssue, handleRefuseByOwner } = useBepro();

  const [isMerging, onMerge, setIsMerging] = useContractTransaction(NetworkEvents.BountyClosed,
                                                                    handleCloseIssue,
                                                                    t("modals.not-mergeable.success-message"),
                                                                    t("errors.something-went-wrong"));
  const [isDisputing, onDispute] = useContractTransaction(NetworkEvents.ProposalDisputed,
                                                          handlerDisputeProposal,
                                                          t("proposal:messages.proposal-disputed"),
                                                          t("errors.something-went-wrong"));
  const [isRefusing, onRefuse] = useContractTransaction(NetworkEvents.ProposalRefused,
                                                        handleRefuseByOwner,
                                                        t("proposal:messages.proposal-refused"),
                                                        t("errors.something-went-wrong"));

  async function handleRefuse () {
    try {
      await onRefuse(+issue?.contractId, +proposal.contractId);

      refresh();
    } catch (error) {
      console.debug("Failed to refuse proposal", error);
    }
  }

  async function handleDispute () {
    try {
      await onDispute(+issue?.contractId, +proposal.contractId);

      refresh();
    } catch (error) {
      console.debug("Failed to dispute proposal", error);
    }
  }

  async function handleMerge () {
    try {
      setIsMerging(true);

      const { url } = await useCreateNft({
        issueId: +issue.id,
        proposalId: proposal.id
      });

      await onMerge(+issue?.contractId, +proposal.contractId, url);

      refresh();
    } catch (error) {
      console.debug("Failed to close bounty", error);
    }
  }

  useEffect(() => {
    const userRoles = (session?.data as CustomSession)?.user?.roles;
    const networkId = proposal?.network_id;
    if (!userRoles || !networkId)
      return;
    setCanCloseTask(UserRoleUtils.hasCloseTaskRole(userRoles, networkId));
  }, [session]);

  return (
    <ProposalActionsButtonsView
      proposal={proposal}
      issueAmount={BigNumber(issue?.amount || issue?.fundingAmount || 0)}
      issueDbId={issue?.id}
      token={issue?.transactionalToken}
      isAbleToMerge={isMergeable}
      isAbleToDispute={isDisputable && isUserAbleToDispute}
      isAbleToRefuse={isRefusable}
      isMerging={isMerging}
      isDisputing={isDisputing}
      isRefusing={isRefusing}
      onlyMerge={onlyMerge}
      canCloseTask={canCloseTask}
      distributedAmounts={distributedAmounts}
      onMerge={handleMerge}
      onDispute={handleDispute}
      onRefuse={handleRefuse}
    />
  );
}