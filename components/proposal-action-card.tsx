import React, {useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import {addSeconds, formatDistance} from "date-fns";
import {useTranslation} from "next-i18next";

import WarningIcon from "assets/icons/warning-icon";

import {ContextualSpan} from "components/contextual-span";
import ContractButton from "components/contract-button";
import ProposalMerge from "components/proposal-merge";
import ProposalProgressBar from "components/proposal-progress-bar";

import {useAppState} from "contexts/app-state";

import {isProposalDisputable} from "helpers/proposal";

import {IssueBigNumberData, IssueData, PullRequest} from "interfaces/issue-data";
import {DistributedAmounts, Proposal} from "interfaces/proposal";

import useOctokit from "x-hooks/use-octokit";

interface IProposalActionCardProps {
  proposal: Proposal;
  issue: IssueData | IssueBigNumberData;
  pullRequest: PullRequest;
  distributedAmounts: DistributedAmounts;
  onMerge: () => Promise<void>;
  onDispute: () => Promise<void>;
  onRefuse: () => Promise<void>;
}

export default function ProposalActionCard({
  proposal,
  issue,
  pullRequest,
  onMerge,
  onDispute,
  onRefuse,
  distributedAmounts
}: IProposalActionCardProps) {
  const { t } = useTranslation(["common", "pull-request", "proposal"]);
  
  const [isMerging, setIsMerging] = useState(false);
  const [isRefusing, setIsRefusing] = useState(false);
  const [chaintime, setChainTime] = useState<number>();
  const [isDisputing, setIsDisputing] = useState(false);
  const [canUserDispute, setCanUserDispute] = useState(false);
  const [allowMergeCommit, setAllowMergeCommit] = useState<boolean>();
  const [chainDisputable, setChainDisputable] = useState<boolean>(false);
  const [missingDisputableTime, setMissingDisputableTime] = useState<string>('');

  const { state } = useAppState();
  const { getRepository } = useOctokit();

  const bountyAmount = 
    BigNumber.maximum(issue?.amount || 0, issue?.fundingAmount || 0);
  const branchProtectionRules = state.Service?.network?.repos?.active?.branchProtectionRules;
  const approvalsRequired = 
    branchProtectionRules ? 
      branchProtectionRules[issue?.branch]?.requiredApprovingReviewCount || 0 : 0;
  const approvalsCurrentPr = pullRequest?.approvals?.total || 0;
  const prsNeedsApproval = approvalsCurrentPr < approvalsRequired;
  const isPrOwner = (
    pullRequest?.userAddress?.toLowerCase() ===
    state.currentUser?.walletAddress?.toLowerCase()
  )
  const isProposalOwner = (
    proposal?.creator?.toLowerCase() ===
    state.currentUser?.walletAddress?.toLowerCase()
  )

  const proposalCanBeDisputed = () => [
    isProposalDisputable(proposal?.contractCreationDate, 
                         BigNumber(state.Service?.network?.times?.disputableTime).toNumber(),
                         chaintime),
    canUserDispute,
    !proposal?.isDisputed,
    !proposal?.refusedByBountyOwner,
    !issue?.isClosed,
    !proposal?.isDisputed,
    !proposal?.isMerged
  ].every(c => c);

  const isRefusable = () => [
    !issue?.isClosed,
    !issue?.isCanceled,
    !proposal?.isDisputed,
    !proposal?.refusedByBountyOwner,
    issue?.creatorAddress?.toLowerCase() === state.currentUser?.walletAddress?.toLowerCase()
  ].every(v => v);

  const canMerge = () => [
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
    !isProposalOwner
    // state.Service?.network?.active?.allowMerge === true
  ].every(v => v);

  const canShowImportant = () => [
    chainDisputable,
    (isPrOwner && !chainDisputable && !proposalCanBeDisputed()),
    (isProposalOwner && !chainDisputable && !proposalCanBeDisputed()),
    allowMergeCommit === false,
    prsNeedsApproval
  ].includes(true);

  function handleRefuse() {
    setIsRefusing(true);
    onRefuse().finally(() => setIsRefusing(false));
  }

  function handleDispute() {
    setIsDisputing(true);
    onDispute().finally(() => setIsDisputing(false));
  }

  function handleMerge() {
    setIsMerging(true);
    onMerge().finally(() => setIsMerging(false));
  }

  function changeMissingDisputableTime() {
    if (!chaintime || !state.Service?.network?.times?.disputableTime || !proposal?.contractCreationDate)
      return;

    const target = addSeconds(new Date(proposal?.contractCreationDate), +state.Service?.network.times.disputableTime);
    const missingTime = formatDistance(new Date(chaintime), target, {includeSeconds: true});

    setMissingDisputableTime(missingTime);
    setChainDisputable(+target - +new Date(chaintime) > 0);
  }

  useEffect(changeMissingDisputableTime, [
    proposal?.contractCreationDate, 
    chaintime, 
    state.Service?.network?.times?.disputableTime
  ]);

  useEffect(() => {
    if (state.Service?.active)
      state.Service?.active.getTimeChain().then(setChainTime);
  }, [state.Service?.active]);

  useEffect(() => {
    if (issue?.repository?.githubPath)
      getRepository(issue?.repository?.githubPath)
        .then(({ mergeCommitAllowed }) => setAllowMergeCommit(mergeCommitAllowed))
        .catch(console.debug);
  }, [state?.currentBounty?.data]);

  useEffect(() => {
    if (!proposal || !state.currentUser?.walletAddress) 
      setCanUserDispute(false);
    else
      setCanUserDispute(!proposal.disputes?.some(({ address, weight }) => 
        address === state.currentUser.walletAddress && weight.gt(0)));
  }, [proposal, state.currentUser?.walletAddress]);

  return (
    <div className="bg-gray-900 rounded-5 p-3">
      <div className="mb-5">
        <ProposalProgressBar
          issueDisputeAmount={proposal?.disputeWeight?.toNumber()}
          disputeMaxAmount={+state.Service?.network?.amounts?.percentageNeededForDispute || 0}
          isDisputed={proposal?.isDisputed}
          isFinished={state.currentBounty?.data?.isClosed}
          isMerged={proposal?.isMerged}
          refused={proposal?.refusedByBountyOwner}
        />
      </div>

      <div className="mt-2 py-2 ">
        {!pullRequest?.isMergeable && !proposal?.isMerged && (
          <span className="text-uppercase text-danger caption-small">
            {t("pull-request:errors.merge-conflicts")}
          </span>
        )}
        
        <div className="row justify-content-center justify-content-xl-between mt-3 gap-2">
          <div className="col-12 col-xl">
            <div className="row">
              <ProposalMerge 
                amountTotal={bountyAmount} 
                tokenSymbol={issue?.transactionalToken?.symbol}
                proposal={proposal}
                isMerging={isMerging}
                idBounty={issue?.id}
                onClickMerge={handleMerge}
                canMerge={canMerge()}
                distributedAmounts={distributedAmounts}
              />
            </div>
          </div>

          {proposalCanBeDisputed() && (
            <div className="col-12 col-xl">
              <div className="row">
                <ContractButton
                  textClass="text-uppercase text-white"
                  color="purple"
                  disabled={isRefusing || isMerging ||  isDisputing || !proposalCanBeDisputed()}
                  onClick={handleDispute}
                  isLoading={isDisputing}
                  withLockIcon={!proposalCanBeDisputed() || isMerging || isRefusing}
                >
                  <span>{t("actions.dispute")}</span>
                </ContractButton>
              </div>
            </div>
          )}

          {isRefusable() && (
            <div className="col-12 col-xl">
              <div className="row">
                <ContractButton
                  textClass="text-uppercase text-white"
                  color="danger"
                  disabled={!isRefusable() || isRefusing || isDisputing || isMerging}
                  onClick={handleRefuse}
                  isLoading={isRefusing}
                  withLockIcon={isDisputing || isMerging}
                >
                  <span>{t("actions.refuse")}</span>
                </ContractButton>
              </div>
            </div>
          )}
        </div>

        {canShowImportant() && (
          <div className="row mt-3">
            <div className="d-flex justify-conten-start ms-2">
              <div>
              <span className="svg-warning">
                <WarningIcon width={14} height={14} className="mb-1" />
              </span>
              <span className="text-warning font-weight-500 mt-3 ms-1">
                {t("proposal:important")}
              </span>
              </div>
            </div>
          </div>
        )}

        { chainDisputable &&
          <div className="row mt-2 ms-1">
            <ContextualSpan context="warning" icon={false}>
              {t('proposal:messages.in-disputable-time', {time: missingDisputableTime})}
            </ContextualSpan>
          </div> || ""
        }

        {(isPrOwner && !chainDisputable && !proposalCanBeDisputed()) && (
          <div className="row mt-2 ms-1">
            <ContextualSpan context="warning" icon={false}>
              {t("proposal:messages.owner-pull-request")}
            </ContextualSpan>
          </div>
        )}

        {(isProposalOwner && !chainDisputable && !proposalCanBeDisputed()) && (
          <div className="row mt-2 ms-1">
            <ContextualSpan context="warning" icon={false}>
              {t("proposal:messages.owner-proposal")}
            </ContextualSpan>
          </div>
        )}

        { allowMergeCommit === false &&
          <div className="row mt-2 ms-1">
            <ContextualSpan context="warning" icon={false}>
              {t("pull-request:errors.merge-commit")}
            </ContextualSpan>
          </div>
        }

        { prsNeedsApproval &&
          <div className="row mt-2 ms-1">
            <ContextualSpan context="warning" icon={false}>
              {t("pull-request:errors.approval")}
            </ContextualSpan>
          </div>
        }
      </div>
    </div>
  );
}
