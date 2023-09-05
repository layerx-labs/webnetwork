import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import { addSeconds, formatDistance } from "date-fns";
import {useTranslation} from "next-i18next";
import { useRouter } from "next/router";

import ProposalPageView from "components/pages/bounty/proposal/view";

import {useAppState} from "contexts/app-state";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { commentsParser, issueParser, mergeProposalParser } from "helpers/issue";
import { isProposalDisputable } from "helpers/proposal";
import { lowerCaseCompare } from "helpers/string";

import { IssueData } from "interfaces/issue-data";
import { DistributedAmounts } from "interfaces/proposal";

import { getCommentsData } from "x-hooks/api/comments";
import { getProposalData } from "x-hooks/api/proposal";
import useReactQuery from "x-hooks/use-react-query";

const defaultAmount = {
  value: "0",
  percentage: "0",
};

export default function ProposalPage() {
  const { query } = useRouter();
  const { t } = useTranslation("common");

  const [chaintime, setChainTime] = useState<number>();
  const [isUserAbleToDispute, setIsUserAbleToDispute] = useState(false);
  const [isDisputableOnChain, setIsDisputableOnChain] = useState<boolean>(false);
  const [missingDisputableTime, setMissingDisputableTime] = useState<string>("");
  const [distributedAmounts, setDistributedAmounts] =
    useState<DistributedAmounts>({
      treasuryAmount: defaultAmount,
      mergerAmount: defaultAmount,
      proposerAmount: defaultAmount,
      proposals: [],
    });

  const { state } = useAppState();

  const proposalId = query?.id?.toString();
  const proposalQueryKey = ["proposal", proposalId];
  const commentsQueryKey = ["proposal", "comments", proposalId];

  const { data: proposal } = useReactQuery(proposalQueryKey, () => getProposalData(query));
  const { data: comments, invalidate: invalidateComments } = 
    useReactQuery(commentsQueryKey, () => getCommentsData({ proposalId }));

  const parsedProposal = mergeProposalParser(proposal, proposal?.issue?.merged);
  const parsedComments = commentsParser(comments);

  const issue = issueParser(proposal?.issue as IssueData);
  const pullRequest = parsedProposal?.pullRequest;
  const networkTokenSymbol = state.Service?.network?.active?.networkToken?.symbol || t("misc.token");

  const isWalletConnected = !!state.currentUser?.walletAddress;
  const isPrOwner = lowerCaseCompare(pullRequest?.userAddress, state.currentUser?.walletAddress);
  const isProposalOwner = lowerCaseCompare(proposal?.creator, state.currentUser?.walletAddress);

  const isDisputable = [
    isWalletConnected,
    isProposalDisputable( proposal?.contractCreationDate,
                          BigNumber(state.Service?.network?.times?.disputableTime).toNumber(),
                          chaintime),
    !proposal?.isDisputed,
    !proposal?.refusedByBountyOwner,
    !issue?.isClosed,
    !proposal?.isMerged,
  ].every((c) => c);

  const isRefusable = [
    isWalletConnected,
    !issue?.isClosed,
    !issue?.isCanceled,
    !proposal?.isDisputed,
    !proposal?.refusedByBountyOwner,
    lowerCaseCompare(issue?.user?.address, state.currentUser?.walletAddress),
  ].every((v) => v);

  const isMergeable = [
    isWalletConnected,
    pullRequest?.isMergeable,
    !issue?.isClosed,
    !proposal?.isMerged,
    !proposal?.isDisputed,
    !proposal?.refusedByBountyOwner,
    !isDisputable,
    !isPrOwner,
    !isProposalOwner,
  ].every((v) => v);

  function updateProposalComments() {
    invalidateComments();
  }

  async function getDistributedAmounts() {
    if (!proposal?.distributions || !state?.Service?.network?.amounts) return;

    const amountTotal = BigNumber.maximum(issue?.amount || 0, issue?.fundingAmount || 0);
    const { treasury, mergeCreatorFeeShare, proposerFeeShare } = state.Service.network.amounts;

    const distributions = calculateDistributedAmounts(treasury,
                                                      mergeCreatorFeeShare,
                                                      proposerFeeShare,
                                                      amountTotal,
                                                      proposal.distributions);

    const proposals = distributions.proposals.map(({ recipient, ...rest }) => ({
      ...rest,
      recipient,
      githubLogin: proposal?.distributions?.find(p => p.recipient === recipient)?.user?.githubLogin
    }));

    setDistributedAmounts({
      ...distributions,
      proposals 
    });
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
    setIsDisputableOnChain(+target - +new Date(chaintime) > 0);
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
      setIsUserAbleToDispute(false);
    else
      setIsUserAbleToDispute(!proposal.disputes?.some(({ address, weight }) => 
        address === state.currentUser.walletAddress && weight.gt(0)));
  }, [proposal, state.currentUser?.walletAddress]);

  useEffect(() => {
    getDistributedAmounts();
  }, [state?.Service?.network?.amounts]);

  return (
    <ProposalPageView
      proposal={parsedProposal}
      pullRequest={pullRequest}
      issue={issue}
      distributedAmounts={distributedAmounts}
      networkTokenSymbol={networkTokenSymbol}
      isUserAbleToDispute={isUserAbleToDispute && isDisputable}
      isDisputableOnChain={isDisputableOnChain}
      missingDisputableTime={missingDisputableTime}
      isDisputable={isDisputable}
      isRefusable={isRefusable}
      isMergeable={isMergeable}
      isPrOwner={isPrOwner}
      isProposalOwner={isProposalOwner}
      comments={parsedComments}
      updateComments={updateProposalComments}
      userData={state.currentUser}
    />
  );
}