import {nativeZeroAddress} from "@taikai/dappkit/dist/src/utils/constants";
import BigNumber from "bignumber.js";
import {useRouter} from "next/router";

import PullAndProposalHeroView from "components/bounty/pull-and-proposal-hero/view";

import {Deliverable} from "interfaces/issue-data";
import {Proposal} from "interfaces/proposal";

interface PullAndProposalHeroPRops {
  proposal?: Proposal;
  pullRequest?: Deliverable;
}

export default function PullAndProposalHero({
  proposal,
  pullRequest,
}: PullAndProposalHeroPRops) {
  const { back } = useRouter();

  const isProposal = !!proposal;
  const { createdAt, issue } = proposal || pullRequest || {};
  const contractId = isProposal ? proposal?.contractId : pullRequest?.prContractId;
  const handle = isProposal ? proposal?.handle : pullRequest?.user?.handle;
  const creatorAddress = proposal?.creator || pullRequest?.user?.address || nativeZeroAddress;

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
      issueAmount={BigNumber(issue?.developerAmount)}
      onBackClick={back}
    />
  );
}
