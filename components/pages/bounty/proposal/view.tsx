import PullAndProposalHero from "components/bounty/pull-and-proposal-hero/controller";
import ConnectWalletButton from "components/connect-wallet-button";
import CustomContainer from "components/custom-container";
import If from "components/If";
import NotMergeableModal from "components/not-mergeable-modal";
import ProposalActionCard from "components/proposal-action-card";
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
  onMerge: () => Promise<void>;
  onRefuse: () => Promise<void>;
  onDispute: () => Promise<void>;
}

export default function ProposalPageView({
  proposal,
  issue,
  pullRequest,
  distributedAmounts,
  networkTokenSymbol,
  onMerge,
  onRefuse,
  onDispute,
}: ProposalPageViewProps) {
  return (
    <>
      <PullAndProposalHero proposal={proposal} />

      <CustomContainer>
        <div className="row mt-3 bg-gray-900 rounded-5 p-3 mx-0">
          <div className="col">
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
            <ProposalActionCard
              proposal={proposal}
              issue={issue}
              pullRequest={pullRequest}
              onMerge={onMerge}
              onDispute={onDispute}
              onRefuse={onRefuse}
              distributedAmounts={distributedAmounts}
            />
          </div>
        </div>
      </CustomContainer>

      <NotMergeableModal pullRequest={pullRequest} proposal={proposal} />

      <ConnectWalletButton asModal={true} />
    </>
  );
}
