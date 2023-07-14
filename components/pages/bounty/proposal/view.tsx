import PullAndProposalHero from "components/bounty/pull-and-proposal-hero/controller";
import ConnectWalletButton from "components/connect-wallet-button";
import CustomContainer from "components/custom-container";
import If from "components/If";
import NotMergeableModal from "components/not-mergeable-modal";
import ProposalActionsButtons from "components/proposal/actions/buttons/controller";
import ProposalActions from "components/proposal/actions/controller";
import { ProposalDisputes } from "components/proposal/disputes-list/controller";
import DistributionBar from "components/proposal/distribution/bar/view";
import ProposalDistributionList from "components/proposal/distribution/list/controller";
import ProposalPullRequestDetails from "components/proposal/pull-request-details/controller";
import ResponsiveWrapper from "components/responsive-wrapper";

import { IssueBigNumberData, PullRequest } from "interfaces/issue-data";
import { DistributedAmounts } from "interfaces/proposal";

import { ProposalPageProps } from "types/pages";

interface ProposalPageViewProps extends ProposalPageProps {
  pullRequest: PullRequest;
  issue: IssueBigNumberData;
  distributedAmounts: DistributedAmounts;
  networkTokenSymbol: string;
  isUserAbleToDispute: boolean;
  isDisputableOnChain: boolean;
  missingDisputableTime: string;
  isDisputable: boolean;
  isRefusable: boolean;
  isMergeable: boolean;
  allowMergeCommit: boolean;
  isPrOwner: boolean;
  isProposalOwner: boolean;
  prsNeedsApproval: boolean;
}

export default function ProposalPageView({
  proposal,
  issue,
  pullRequest,
  distributedAmounts,
  networkTokenSymbol,
  isUserAbleToDispute,
  isDisputableOnChain,
  missingDisputableTime,
  isDisputable,
  isRefusable,
  isMergeable,
  allowMergeCommit,
  isPrOwner,
  isProposalOwner,
  prsNeedsApproval,
}: ProposalPageViewProps) {
  return (
    <>
      <PullAndProposalHero proposal={proposal} />

      <CustomContainer>
        <If condition={isMergeable}>
          <div className="row justify-content-center d-flex d-xl-none mt-3">
            <ProposalActionsButtons
              issue={issue}
              proposal={proposal}
              distributedAmounts={distributedAmounts}
              isUserAbleToDispute={isUserAbleToDispute}
              isDisputable={isDisputable}
              isRefusable={isRefusable}
              isMergeable={isMergeable}
              onlyMerge={true}
            />
          </div>
        </If>

        <div className="row mt-3 bg-gray-900 rounded-5 p-3 mx-0">
          <div className="col p-0">
            <ProposalPullRequestDetails
              pullRequest={pullRequest}
              issue={issue}
            />

            <ResponsiveWrapper xs={false} xl={true}>
              <div className="mt-4 w-100">
                <DistributionBar distributedAmounts={distributedAmounts} />
              </div>
            </ResponsiveWrapper>
          </div>
        </div>

        <div className="mt-3 row justify-content-between">
          <div className="col-12 col-xl-6">
            <div className="row">
              <ProposalDistributionList
                distributedAmounts={distributedAmounts}
                transactionalTokenSymbol={issue?.transactionalToken?.symbol}
              />
            </div>

            <If condition={!!proposal?.disputes?.length}>
              <div className="row">
                <ProposalDisputes
                  disputes={proposal?.disputes}
                  networkTokenSymbol={networkTokenSymbol}
                />
              </div>
            </If>
          </div>

          <div className="col-12 col-xl-6">
            <ProposalActions
              proposal={proposal}
              issue={issue}
              pullRequest={pullRequest}
              distributedAmounts={distributedAmounts}
              isUserAbleToDispute={isUserAbleToDispute}
              isDisputableOnChain={isDisputableOnChain}
              missingDisputableTime={missingDisputableTime}
              isDisputable={isDisputable}
              isRefusable={isRefusable}
              isMergeable={isMergeable}
              allowMergeCommit={allowMergeCommit}
              isPrOwner={isPrOwner}
              isProposalOwner={isProposalOwner}
              prsNeedsApproval={prsNeedsApproval}
            />
          </div>
        </div>
      </CustomContainer>

      <NotMergeableModal pullRequest={pullRequest} proposal={proposal} />

      <ConnectWalletButton asModal={true} />
    </>
  );
}
