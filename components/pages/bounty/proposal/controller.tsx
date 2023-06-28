import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import ProposalPageView from "components/pages/bounty/proposal/view";

import {useAppState} from "contexts/app-state";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { issueParser, mergeProposalParser, pullRequestParser } from "helpers/issue";

import { IssueData } from "interfaces/issue-data";
import { DistributedAmounts } from "interfaces/proposal";

import { ProposalPageProps } from "types/pages";

const defaultAmount = {
  value: "0",
  percentage: "0",
};

export default function ProposalPage(props: ProposalPageProps) {
  const { t } = useTranslation("common");

  const [distributedAmounts, setDistributedAmounts] =
    useState<DistributedAmounts>({
      treasuryAmount: defaultAmount,
      mergerAmount: defaultAmount,
      proposerAmount: defaultAmount,
      proposals: [],
    });

  const { state } = useAppState();

  const proposal = mergeProposalParser(props?.proposal, props?.proposal?.issue?.merged);
  const issue = issueParser(proposal?.issue as IssueData);
  const pullRequest = pullRequestParser(proposal?.pullRequest);
  const networkTokenSymbol = state.Service?.network?.active?.networkToken?.symbol || t("misc.token");

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

  useEffect(() => {
    getDistributedAmounts();
  }, [state?.Service?.network?.amounts]);

  return (
    <ProposalPageView
      proposal={proposal}
      pullRequest={pullRequest}
      issue={issue}
      distributedAmounts={distributedAmounts}
      networkTokenSymbol={networkTokenSymbol}
    />
  );
}