import React from "react";

import BigNumber from "bignumber.js";
import {useRouter} from "next/router";
import {v4 as uuidv4} from "uuid";

import {Deliverable, IssueBigNumberData} from "interfaces/issue-data";
import {Proposal} from "interfaces/proposal";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";

import ItemRowView from "./view";

interface ItemRowProps {
  item: Proposal | Deliverable;
  isProposal: boolean;
  currentBounty: IssueBigNumberData;
}

export default function ItemRow({
  item,
  isProposal,
  currentBounty
}: ItemRowProps) {
  const { currentUser } = useUserStore();

  const router = useRouter();
  const { active: activeMarketplace, getURLWithNetwork, getTotalNetworkToken } = useMarketplace();
  const { data: totalNetworkToken } = getTotalNetworkToken();

  const pathRedirect = isProposal ? "task/[id]/proposal/[proposalId]" : "task/[id]/deliverable/[deliverableId]";
  const valueRedirect: {
    id: number | string;
    deliverableId?: number;
    proposalId?: number;
    review?: boolean;
  } = {
    id: currentBounty?.id
  };
  const status = [];

  const proposal = currentBounty?.mergeProposals?.find((proposal) => 
                                                        proposal.contractId === +(item as Proposal)?.contractId);
  const isDisputed = !!proposal?.isDisputed;
  const isMerged = !!(item as Proposal)?.isMerged;
  const isRefused = !!(item as Proposal)?.refusedByBountyOwner;
  const isCanceledDeliverable = !!(item as Deliverable)?.canceled;
  const isDraftDeliverable = !isCanceledDeliverable && !(item as Deliverable)?.markedReadyForReview;
  if (!isProposal) {
    status.push({
      merged: (item as Deliverable)?.accepted,
      isMergeable:
        (item as Deliverable)?.markedReadyForReview &&
        !currentBounty?.deliverables?.find((d) => d.accepted) &&
        !(item as Deliverable)?.canceled,
      isDraft: isDraftDeliverable
    });
    valueRedirect.deliverableId = (item as Deliverable)?.id;
  } else if (proposal) {
    if (isDisputed || isMerged) {
      status.push({
        label: isDisputed ? "disputed" : "accepted",
      });
    }
    if (proposal.refusedByBountyOwner) status.push({ label: "refused" });

    valueRedirect.proposalId = item?.id;
  }

  const itemId = isProposal
    ? (item as Proposal)?.contractId + 1
    : (item as Deliverable)?.id;

  const totalToBeDisputed = BigNumber(activeMarketplace?.percentageNeededForDispute)
    .multipliedBy(totalNetworkToken)
    .dividedBy(100);

  const isCurator = !!currentUser?.isCouncil;

  const btnLabel = isProposal
    ? "actions.view-proposal"
    : (isDraftDeliverable || isCanceledDeliverable || !isCurator || !!currentBounty?.isClosed)
    ? "actions.view-deliverable"
    : "actions.review";
  const isReviewAction = btnLabel === "actions.review";

  function handleBtn(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    ev.preventDefault();
    router.push(getURLWithNetwork(pathRedirect, {
      ...valueRedirect,
      ... !isProposal && isReviewAction ? { review: true } : {}
    }));
  }

  return (
    <ItemRowView
      key={`${uuidv4()} ${item?.id}`}
      id={itemId}
      item={item}
      href={getURLWithNetwork(pathRedirect, valueRedirect)}
      handleBtn={handleBtn}
      isProposal={isProposal}
      status={status}
      btnLabel={btnLabel}
      proposal={proposal}
      isDisputed={isDisputed}
      isMerged={isMerged}
      totalToBeDisputed={totalToBeDisputed}
      isRefused={isRefused}
    />
  );
}
