import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { addSeconds, formatDistance } from "date-fns";
import { useTranslation } from "next-i18next";

import ProposalActionsView from "components/proposal/actions/view";

import { useAppState } from "contexts/app-state";

import { isProposalDisputable } from "helpers/proposal";
import { toLower } from "helpers/string";

import { NetworkEvents } from "interfaces/enums/events";
import {
  IssueBigNumberData,
  IssueData,
  PullRequest,
} from "interfaces/issue-data";
import { DistributedAmounts, Proposal } from "interfaces/proposal";

import useApi from "x-hooks/use-api";
import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";
import useRefresh from "x-hooks/use-refresh";

interface ProposalActionsProps {
  proposal: Proposal;
  issue: IssueData | IssueBigNumberData;
  pullRequest: PullRequest;
  distributedAmounts: DistributedAmounts;
}

export default function ProposalActions({
  proposal,
  issue,
  pullRequest,
  distributedAmounts,
}: ProposalActionsProps) {
  const { t } = useTranslation(["common", "pull-request", "proposal"]);

  const [chaintime, setChainTime] = useState<number>();
  const [canUserDispute, setCanUserDispute] = useState(false);
  const [chainDisputable, setChainDisputable] = useState<boolean>(false);
  const [missingDisputableTime, setMissingDisputableTime] =
    useState<string>("");

  const { createNFT } = useApi();
  const { state } = useAppState();
  const { refresh } = useRefresh();
  const { handlerDisputeProposal, handleCloseIssue, handleRefuseByOwner } =
    useBepro();

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

  const allowMergeCommit = issue?.repository?.mergeCommitAllowed;
  const bountyAmount = BigNumber.maximum(issue?.amount || 0, issue?.fundingAmount || 0);
  const branchProtectionRules =
    state.Service?.network?.repos?.active?.branchProtectionRules;
  const approvalsRequired = branchProtectionRules
    ? branchProtectionRules[issue?.branch]?.requiredApprovingReviewCount || 0
    : 0;
  const approvalsCurrentPr = pullRequest?.approvals?.total || 0;
  const prsNeedsApproval = approvalsCurrentPr < approvalsRequired;
  const isPrOwner =
    toLower(pullRequest?.userAddress) ===
    toLower(state.currentUser?.walletAddress);
  const isProposalOwner =
    toLower(proposal?.creator) === toLower(state.currentUser?.walletAddress);

  const proposalCanBeDisputed = () =>
    [
      isProposalDisputable( proposal?.contractCreationDate,
                            BigNumber(state.Service?.network?.times?.disputableTime).toNumber(),
                            chaintime),
      canUserDispute,
      !proposal?.isDisputed,
      !proposal?.refusedByBountyOwner,
      !issue?.isClosed,
      !proposal?.isDisputed,
      !proposal?.isMerged,
    ].every((c) => c);

  const isRefusable = () =>
    [
      !issue?.isClosed,
      !issue?.isCanceled,
      !proposal?.isDisputed,
      !proposal?.refusedByBountyOwner,
      issue?.creatorAddress?.toLowerCase() ===
        state.currentUser?.walletAddress?.toLowerCase(),
    ].every((v) => v);

  const canMerge = () =>
    [
      pullRequest?.isMergeable,
      !proposal?.isMerged,
      !proposal?.isDisputed,
      !proposal?.refusedByBountyOwner,
      !isProposalDisputable(proposal?.contractCreationDate,
                            BigNumber(state.Service?.network?.times?.disputableTime).toNumber(),
                            chaintime),
      !isMerging,
      !isRefusing,
      !isDisputing,
      allowMergeCommit === true,
      !prsNeedsApproval,
      !isPrOwner,
      !isProposalOwner,
    ].every((v) => v);

  const warnings = [
    ...(chainDisputable
      ? [
          t("proposal:messages.in-disputable-time", {
            time: missingDisputableTime,
          }),
      ]
      : []),
    ...(isPrOwner && !chainDisputable && !proposalCanBeDisputed()
      ? [t("proposal:messages.owner-pull-request")]
      : []),
    ...(isProposalOwner && !chainDisputable && !proposalCanBeDisputed()
      ? [t("proposal:messages.owner-proposal")]
      : []),
    ...(allowMergeCommit === false
      ? [t("pull-request:errors.merge-commit")]
      : []),
    ...(prsNeedsApproval ? [t("pull-request:errors.approval")] : []),
  ];

  async function handleRefuse() {
    try {
      await onRefuse(+issue?.contractId, +proposal.contractId);

      refresh();
    } catch (error) {
      console.debug("Failed to refuse proposal", error);
    }
  }

  async function handleDispute() {
    try {
      await onDispute(+issue?.contractId, +proposal.contractId);

      refresh();
    } catch (error) {
      console.debug("Failed to dispute proposal", error);
    }
  }

  async function handleMerge() {
    try {
      setIsMerging(true);
      
      const { url } = await createNFT(issue?.contractId,
                                      proposal.contractId,
                                      state.currentUser?.walletAddress);

      await onMerge(+issue?.contractId, +proposal.contractId, url);

      refresh();
    } catch (error) {
      console.debug("Failed to close bounty", error);
    }
  }

  function changeMissingDisputableTime() {
    if (
      !chaintime ||
      !state.Service?.network?.times?.disputableTime ||
      !proposal?.contractCreationDate
    )
      return;

    const target = addSeconds(new Date(proposal?.contractCreationDate), +state.Service?.network.times.disputableTime);
    const missingTime = formatDistance(new Date(chaintime), target, {
      includeSeconds: true,
    });

    setMissingDisputableTime(missingTime);
    setChainDisputable(+target - +new Date(chaintime) > 0);
  }

  useEffect(changeMissingDisputableTime, [
    proposal?.contractCreationDate,
    chaintime,
    state.Service?.network?.times?.disputableTime,
  ]);

  useEffect(() => {
    if (state.Service?.active)
      state.Service?.active.getTimeChain().then(setChainTime);
  }, [state.Service?.active]);

  useEffect(() => {
    if (!proposal || !state.currentUser?.walletAddress)
      setCanUserDispute(false);
    else
      setCanUserDispute(!proposal.disputes?.some(({ address, weight }) => address === state.currentUser.walletAddress 
                                                                          && weight.gt(0)));
  }, [proposal, state.currentUser?.walletAddress]);

  return (
    <ProposalActionsView
      proposal={proposal}
      issue={issue}
      pullRequest={pullRequest}
      bountyAmount={bountyAmount}
      distributedAmounts={distributedAmounts}
      percentageNeededForDispute={
        +state.Service?.network?.amounts?.percentageNeededForDispute
      }
      warnings={warnings}
      isAbleToMerge={canMerge()}
      isAbleToDispute={proposalCanBeDisputed()}
      isAbleToRefuse={isRefusable()}
      isMerging={isMerging}
      isRefusing={isRefusing}
      isDisputing={isDisputing}
      onMerge={handleMerge}
      onDispute={handleDispute}
      onRefuse={handleRefuse}
    />
  );
}
