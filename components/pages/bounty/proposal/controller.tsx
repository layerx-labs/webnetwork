import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import ProposalPageView from "components/pages/bounty/proposal/view";

import {useAppState} from "contexts/app-state";
import {addToast} from "contexts/reducers/change-toaster";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { issueParser, mergeProposalParser, pullRequestParser } from "helpers/issue";

import { MetamaskErrors } from "interfaces/enums/Errors";
import { NetworkEvents } from "interfaces/enums/events";
import { IssueData } from "interfaces/issue-data";
import { DistributedAmounts } from "interfaces/proposal";

import { ProposalPageProps } from "types/pages";

import useApi from "x-hooks/use-api";
import useBepro from "x-hooks/use-bepro";
import useRefresh from "x-hooks/use-refresh";

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

  const { refresh } = useRefresh();
  const { dispatch, state } = useAppState();
  const { processEvent, createNFT } = useApi();
  const { handlerDisputeProposal, handleCloseIssue, handleRefuseByOwner } = useBepro();

  const proposal = mergeProposalParser(props?.proposal, props?.proposal?.issue?.merged);
  const issue = issueParser(proposal?.issue as IssueData);
  const pullRequest = pullRequestParser(proposal?.pullRequest);
  const networkTokenSymbol = state.Service?.network?.active?.networkToken?.symbol || t("misc.token");
    
  async function closeIssue() {
    try{
      if (!state.currentUser?.walletAddress) return;

      const { url } =
        await createNFT(issue?.contractId, proposal.contractId, state.currentUser?.walletAddress);
      
      await handleCloseIssue(+issue?.contractId, +proposal.contractId, url)
        .then(async txInfo => {
          const { blockNumber: fromBlock } = txInfo as { blockNumber: number };
          
          return Promise.all([processEvent(NetworkEvents.BountyClosed, undefined, { fromBlock } )]);
        })
        .then(() => {
          refresh();
          dispatch(addToast({
              type: "success",
              title: t("actions.success"),
              content: t("modals.not-mergeable.success-message")
          }));
        })
    }
    catch(error){
      if (error?.code === MetamaskErrors.UserRejected) return;

      console.log("Failed to close bounty", error);

      dispatch(addToast({
            type: "danger",
            title: t("actions.failed"),
            content: error?.response?.data?.message
      }))}
  }

  async function disputeProposal() {
    return handlerDisputeProposal(+proposal?.contractId)
      .then(txInfo => {
        const { blockNumber: fromBlock } = txInfo as { blockNumber: number };

        return processEvent(NetworkEvents.ProposalDisputed, undefined, { fromBlock } );
      })
      .then(() => refresh())
      .catch(error => {
        if (error?.code === MetamaskErrors.UserRejected) return;

        console.log("Failed to dispute proposal", error);

        dispatch(addToast({
            type: "danger",
            title: t("actions.failed"),
            content: error?.response?.data?.message
        }));
      });
  }

  async function handleRefuse() {
    return handleRefuseByOwner(+issue?.contractId, +proposal.contractId)
      .then(txInfo => {
        const { blockNumber: fromBlock } = txInfo as { blockNumber: number };

        return processEvent(NetworkEvents.ProposalRefused, undefined, { fromBlock } );
      })
      .then(() => refresh())
      .then( () => {
        dispatch(addToast({
          type: "success",
          title: t("actions.success"),
          content: t("proposal:messages.proposal-refused")
        }))
      })
      .catch(error => {
        if (error?.code === MetamaskErrors.UserRejected) return;
        
        console.log("Failed to refuse proposal", error);

        dispatch(addToast({
            type: "danger",
            title: t("actions.failed"),
            content: error?.response?.data?.message
        }));
      });
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
      onMerge={closeIssue}
      onRefuse={handleRefuse}
      onDispute={disputeProposal}
    />
  );
}