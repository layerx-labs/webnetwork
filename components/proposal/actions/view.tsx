import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import WarningIcon from "assets/icons/warning-icon";

import { ContextualSpan } from "components/contextual-span";
import ContractButton from "components/contract-button";
import If from "components/If";
import ProposalMerge from "components/proposal-merge";
import ProposalProgressBar from "components/proposal-progress-bar";

import {
  IssueBigNumberData,
  IssueData,
  PullRequest,
} from "interfaces/issue-data";
import { DistributedAmounts, Proposal } from "interfaces/proposal";

interface ProposalActionsViewProps {
  proposal: Proposal;
  issue: IssueData | IssueBigNumberData;
  pullRequest: PullRequest;
  distributedAmounts: DistributedAmounts;
  percentageNeededForDispute: number;
  bountyAmount: BigNumber;
  warnings: string[];
  isAbleToMerge: boolean;
  isAbleToDispute: boolean;
  isAbleToRefuse: boolean;
  isMerging: boolean;
  isRefusing: boolean;
  isDisputing: boolean;
  onMerge: () => Promise<void>;
  onDispute: () => Promise<void>;
  onRefuse: () => Promise<void>;
}

export default function ProposalActionsView({
  proposal,
  issue,
  pullRequest,
  bountyAmount,
  distributedAmounts,
  percentageNeededForDispute,
  warnings,
  isAbleToMerge,
  isAbleToDispute,
  isAbleToRefuse,
  isMerging,
  isRefusing,
  isDisputing,
  onMerge,
  onDispute,
  onRefuse,
}: ProposalActionsViewProps) {
  const { t } = useTranslation(["common", "pull-request", "proposal"]);

  const isDisputeButtonDisabled = isRefusing || isMerging || isDisputing || !isAbleToDispute;
  const isRefuseButtonDisabled = !isAbleToRefuse || isRefusing || isDisputing || isMerging;
  const hasWarnings = !!warnings?.length;

  return (
    <div className="bg-gray-900 rounded-5 p-3">
      <div className="mb-5">
        <ProposalProgressBar
          issueDisputeAmount={proposal?.disputeWeight?.toNumber()}
          disputeMaxAmount={percentageNeededForDispute || 0}
          isDisputed={proposal?.isDisputed}
          isFinished={issue?.isClosed}
          isMerged={proposal?.isMerged}
          refused={proposal?.refusedByBountyOwner}
        />
      </div>

      <div className="mt-2 py-2 ">
        <If condition={!pullRequest?.isMergeable && !proposal?.isMerged}>
          <span className="text-uppercase text-danger caption-small">
            {t("pull-request:errors.merge-conflicts")}
          </span>
        </If>

        <div className="row justify-content-center justify-content-xl-between mt-3 gap-2">
          <div className="col-12 col-xl">
            <div className="row">
              <ProposalMerge
                amountTotal={bountyAmount}
                tokenSymbol={issue?.transactionalToken?.symbol}
                proposal={proposal}
                isMerging={isMerging}
                idBounty={issue?.id}
                onClickMerge={onMerge}
                canMerge={isAbleToMerge}
                distributedAmounts={distributedAmounts}
              />
            </div>
          </div>

          <If condition={isAbleToDispute}>
            <div className="col-12 col-xl">
              <div className="row">
                <ContractButton
                  textClass="text-uppercase text-white"
                  color="purple"
                  disabled={isDisputeButtonDisabled}
                  onClick={onDispute}
                  isLoading={isDisputing}
                  withLockIcon={!isAbleToDispute || isMerging || isRefusing}
                >
                  <span>{t("actions.dispute")}</span>
                </ContractButton>
              </div>
            </div>
          </If>

          <If condition={isAbleToRefuse}>
            <div className="col-12 col-xl">
                <div className="row">
                  <ContractButton
                    textClass="text-uppercase text-white"
                    color="danger"
                    disabled={isRefuseButtonDisabled}
                    onClick={onRefuse}
                    isLoading={isRefusing}
                    withLockIcon={isDisputing || isMerging}
                  >
                    <span>{t("actions.refuse")}</span>
                  </ContractButton>
                </div>
              </div>
          </If>
        </div>

        <If condition={hasWarnings}>
          <div className="row mt-3">
            <div className="d-flex justify-conten-start ms-2">
              <div>
                <span className="svg-warning">
                  <WarningIcon width={14} height={14} className="mb-1" />
                </span>
                <span className="text-warning font-weight-500 mt-3 ms-1">
                  {t("proposal:important")}
                </span>
              </div>
            </div>
          </div>

          {warnings?.map(warning =>
            <div className="row mt-2 ms-1">
              <ContextualSpan context="warning" icon={false}>
                {warning}
              </ContextualSpan>
            </div>)}
        </If>
      </div>
    </div>
  );
}
