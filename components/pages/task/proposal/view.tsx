import Comments from "components/bounty/comments/controller";
import PullAndProposalHero from "components/bounty/pull-and-proposal-hero/controller";
import CustomContainer from "components/custom-container";
import If from "components/If";
import ProposalActionsButtons from "components/proposal/actions/buttons/controller";
import ProposalActions from "components/proposal/actions/controller";
import ProposalDeliverableDetails from "components/proposal/deliverable-details/controller";
import { ProposalDisputes } from "components/proposal/disputes-list/controller";
import DistributionBar from "components/proposal/distribution/bar/view";
import ProposalDistributionList from "components/proposal/distribution/list/controller";
import ResponsiveWrapper from "components/responsive-wrapper";

import { CurrentUserState } from "interfaces/application-state";
import { Deliverable, IssueBigNumberData, IssueDataComment } from "interfaces/issue-data";
import { DistributedAmounts } from "interfaces/proposal";

import { ProposalPageProps } from "types/pages";

interface ProposalPageViewProps extends ProposalPageProps {
  deliverable: Deliverable;
  issue: IssueBigNumberData;
  distributedAmounts: DistributedAmounts;
  networkTokenSymbol: string;
  isUserAbleToDispute: boolean;
  isDisputableOnChain: boolean;
  missingDisputableTime: string;
  isDisputable: boolean;
  isRefusable: boolean;
  isMergeable: boolean;
  comments: IssueDataComment[];
  userData: CurrentUserState;
}

export default function ProposalPageView({
  proposal,
  issue,
  deliverable,
  distributedAmounts,
  networkTokenSymbol,
  isUserAbleToDispute,
  isDisputableOnChain,
  missingDisputableTime,
  isDisputable,
  isRefusable,
  isMergeable,
  comments,
  userData
}: ProposalPageViewProps) {
  return (
    <>
      <PullAndProposalHero
        proposal={proposal}
      />

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

        <div className="row mt-3 bg-gray-900 rounded-5 border border-gray-850 p-3 mx-0">
          <div className="col p-0">
            <ProposalDeliverableDetails
              deliverable={deliverable}
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
                token={issue?.transactionalToken}
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
              distributedAmounts={distributedAmounts}
              isUserAbleToDispute={isUserAbleToDispute}
              isDisputableOnChain={isDisputableOnChain}
              missingDisputableTime={missingDisputableTime}
              isDisputable={isDisputable}
              isRefusable={isRefusable}
              isMergeable={isMergeable}
            />
          </div>
        </div>
        <div className="row mt-3 mb-5 bg-gray-900 border-radius-8 mx-0">
        <Comments
            comments={comments}
            type="proposal"
            ids={{
              issueId: +issue?.id,
              proposalId: proposal?.id,
            }}
            currentUser={userData}
            disableCreateComment={issue?.isClosed}
          />
        </div>
      </CustomContainer>

    </>
  );
}
