import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import { addSeconds, formatDistance } from "date-fns";
import {useTranslation} from "next-i18next";
import { useRouter } from "next/router";



import {useAppState} from "contexts/app-state";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { commentsParser, deliverableParser, issueParser, mergeProposalParser } from "helpers/issue";
import { isProposalDisputable } from "helpers/proposal";
import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import { IssueData } from "interfaces/issue-data";
import { DistributedAmounts } from "interfaces/proposal";

import { getCommentsData } from "x-hooks/api/comments";
import { getProposalData } from "x-hooks/api/proposal";
import useBepro from "x-hooks/use-bepro";
import useReactQuery from "x-hooks/use-react-query";

import ProposalPageView from "./view";

const defaultAmount = {
  value: "0",
  percentage: "0",
};

export default function ProposalPage() {
  const { query } = useRouter();
  const { t } = useTranslation("common");

  const [chaintime, setChainTime] = useState<number>();
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
  const { getTimeChain } = useBepro();

  const proposalId = query?.proposalId?.toString();
  const proposalQueryKey = QueryKeys.proposal(proposalId);
  const commentsQueryKey = QueryKeys.proposalComments(proposalId);

  const { data: proposalData } = useReactQuery(proposalQueryKey, () => getProposalData(query));
  const { data: comments } = 
    useReactQuery(commentsQueryKey, () => getCommentsData({ proposalId }));

  const parsedProposal = proposalData ? mergeProposalParser(proposalData, proposalData?.issue?.merged) : null;
  const parsedComments = comments ? commentsParser(comments) : null;
  const issue = proposalData ? issueParser(parsedProposal?.issue as IssueData) : null;
  const deliverable = proposalData ? deliverableParser(parsedProposal?.deliverable) : null;
  const networkTokenSymbol = state.Service?.network?.active?.networkToken?.symbol || t("misc.token");

  const isWalletConnected = !!state.currentUser?.walletAddress;

  const isUserAbleToDispute = isWalletConnected ? !parsedProposal?.disputes?.some(({ address, weight }) => 
    lowerCaseCompare(address, state.currentUser?.walletAddress) && weight.gt(0)) : false;

  const isDisputable = [
    isWalletConnected,
    isProposalDisputable( parsedProposal?.contractCreationDate,
                          BigNumber(state.Service?.network?.active?.disputableTime).toNumber(),
                          chaintime),
    !parsedProposal?.isDisputed,
    !parsedProposal?.refusedByBountyOwner,
    !issue?.isClosed,
    !parsedProposal?.isMerged,
  ].every((c) => c);

  const isRefusable = [
    isWalletConnected,
    !issue?.isClosed,
    !issue?.isCanceled,
    !parsedProposal?.isDisputed,
    !parsedProposal?.refusedByBountyOwner,
    lowerCaseCompare(issue?.user?.address, state.currentUser?.walletAddress),
  ].every((v) => v);

  const isMergeable = [
    isWalletConnected,
    deliverable?.markedReadyForReview && !deliverable?.canceled,
    !issue?.isClosed,
    !parsedProposal?.isMerged,
    !parsedProposal?.isDisputed,
    !parsedProposal?.refusedByBountyOwner,
    !isDisputable,
  ].every((v) => v);

  async function getDistributedAmounts() {
    if (!parsedProposal?.distributions || !state?.Service?.network?.active) return;

    const amountTotal = BigNumber.maximum(issue?.amount || 0, issue?.fundingAmount || 0);
    const { mergeCreatorFeeShare, proposerFeeShare, chain } = state.Service.network.active;

    const distributions = calculateDistributedAmounts(chain.closeFeePercentage,
                                                      mergeCreatorFeeShare,
                                                      proposerFeeShare,
                                                      amountTotal,
                                                      parsedProposal?.distributions);

    const proposals = distributions.proposals.map(({ recipient, ...rest }) => ({
      ...rest,
      recipient,
      githubLogin: parsedProposal?.distributions?.find(p => p.recipient === recipient)?.user?.githubLogin
    }));

    setDistributedAmounts({
      ...distributions,
      proposals 
    });
  }

  function changeMissingDisputableTime() {
    if (
      !chaintime ||
      !state.Service?.network?.active?.disputableTime ||
      !parsedProposal?.contractCreationDate
    )
      return;

    const target = addSeconds(new Date(parsedProposal?.contractCreationDate), 
                              +state.Service?.network.active.disputableTime);
    const missingTime = formatDistance(new Date(chaintime), target, {
      includeSeconds: true,
    });

    setMissingDisputableTime(missingTime);
    setIsDisputableOnChain(+target - +new Date(chaintime) > 0);
  }

  useEffect(changeMissingDisputableTime, [
    parsedProposal?.contractCreationDate,
    chaintime,
    state.Service?.network?.active?.disputableTime,
  ]);

  useEffect(() => {
    if (state.Service?.active)
      getTimeChain().then(setChainTime);
  }, [state.Service?.active]);

  useEffect(() => {
    getDistributedAmounts();
  }, [state?.Service?.network?.active?.networkAddress]);

  return (
    <ProposalPageView
      proposal={parsedProposal}
      deliverable={deliverable}
      issue={issue}
      distributedAmounts={distributedAmounts}
      networkTokenSymbol={networkTokenSymbol}
      isUserAbleToDispute={isUserAbleToDispute && isDisputable}
      isDisputableOnChain={isDisputableOnChain}
      missingDisputableTime={missingDisputableTime}
      isDisputable={isDisputable}
      isRefusable={isRefusable}
      isMergeable={isMergeable}
      comments={parsedComments}
      userData={state.currentUser}
    />
  );
}