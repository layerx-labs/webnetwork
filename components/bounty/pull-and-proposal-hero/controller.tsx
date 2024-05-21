import {nativeZeroAddress} from "@taikai/dappkit/dist/src/utils/constants";
import BigNumber from "bignumber.js";
import {useRouter} from "next/router";

import PullAndProposalHeroView from "components/bounty/pull-and-proposal-hero/view";

import {Deliverable} from "interfaces/issue-data";
import {Proposal} from "interfaces/proposal";

import useMarketplace from "x-hooks/use-marketplace";

interface PullAndProposalHeroPRops {
  proposal?: Proposal;
  pullRequest?: Deliverable;
}

export default function PullAndProposalHero({
  proposal,
  pullRequest,
}: PullAndProposalHeroPRops) {
  const { query, back, push } = useRouter();

  const { getURLWithNetwork } = useMarketplace();

  const isProposal = !!proposal;
  const { createdAt, issue } = proposal || pullRequest || {};
  const contractId = isProposal ? proposal?.contractId : pullRequest?.prContractId;
  const handle = isProposal ? proposal?.handle : pullRequest?.user?.handle;
  const creatorAddress = proposal?.creator || pullRequest?.user?.address || nativeZeroAddress;

  function onBackClick () {
    if (!isProposal && !!query?.fromProposal) {
      back();
      return;
    }
    const taskId = (proposal || pullRequest)?.issueId;
    push(getURLWithNetwork("/task/[id]", { id: taskId }));
  }

  return (
    <PullAndProposalHeroView
      contractId={contractId}
      handle={handle}
      createdAt={createdAt}
      creatorAddress={creatorAddress}
      issueTitle={issue?.title}
      issueId={issue?.id}
      isProposal={isProposal}
      token={issue?.transactionalToken}
      avatarHash={proposal?.user?.avatar}
      issueAmount={BigNumber(issue?.developerAmount)}
      onBackClick={onBackClick}
    />
  );
}
