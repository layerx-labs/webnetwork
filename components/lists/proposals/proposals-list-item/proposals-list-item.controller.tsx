import React from "react";

import BigNumber from "bignumber.js";
import { useRouter } from "next/router";

import { ProposalsListItemView } from "components/lists/proposals/proposals-list-item/proposals-list-item.view";

import { getTimeDifferenceInWords } from "helpers/formatDate";
import { getProposalStatus } from "helpers/proposal";

import { Proposal } from "interfaces/proposal";

import useMarketplace from "x-hooks/use-marketplace";

interface ProposalsListItemProps {
  proposal: Proposal;
}
export function ProposalsListItem ({
  proposal,
}: ProposalsListItemProps) {
  const router = useRouter();

  const { getURLWithNetwork, getTotalNetworkToken } = useMarketplace();

  const { data: totalNetworkToken } =
    getTotalNetworkToken(proposal?.network?.name, proposal?.network?.chain?.chainShortName);
  const disputePercentage = totalNetworkToken ?
    +BigNumber(proposal?.disputeWeight || 0).dividedBy(totalNetworkToken).multipliedBy(100).toFixed(2) : 0;
  const status = getProposalStatus(proposal);

  function onClick () {
    router.push(getURLWithNetwork("/task/[id]/proposal/[proposalId]", {
      network: proposal?.network?.name,
      id: proposal?.issue?.id,
      proposalId: proposal?.id,
    }));
  }

  return (
    <ProposalsListItemView
      proposal={proposal}
      disputePercentage={disputePercentage}
      timeText={getTimeDifferenceInWords(new Date(proposal?.createdAt), new Date(), true)}
      status={status}
      onClick={onClick}
    />
  );
}