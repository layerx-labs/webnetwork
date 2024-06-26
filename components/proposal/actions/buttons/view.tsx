import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import ProposalMerge from "components/proposal-merge";

import { DistributedAmounts, Proposal } from "interfaces/proposal";
import { Token } from "interfaces/token";

interface ProposalActionsButtonsViewProps {
  proposal: Proposal;
  issueAmount: BigNumber;
  issueDbId: string;
  token: Token;
  isAbleToMerge: boolean;
  isAbleToDispute: boolean;
  isAbleToRefuse: boolean;
  isMerging: boolean;
  isDisputing: boolean;
  isRefusing: boolean;
  onlyMerge?: boolean;
  canCloseTask?: boolean;
  distributedAmounts: DistributedAmounts;
  onMerge: () => Promise<void>;
  onDispute: () => Promise<void>;
  onRefuse: () => Promise<void>;
}

export default function ProposalActionsButtonsView ({
  issueAmount,
  issueDbId,
  token,
  isAbleToMerge,
  isAbleToDispute,
  isAbleToRefuse,
  isMerging,
  isDisputing,
  isRefusing,
  onlyMerge,
  canCloseTask,
  distributedAmounts,
  onMerge,
  onDispute,
  onRefuse,
}: ProposalActionsButtonsViewProps) {
  const { t } = useTranslation(["common"]);

  const isDisputeButtonDisabled = isRefusing || isMerging || isDisputing || !isAbleToDispute;
  const isRefuseButtonDisabled = !isAbleToRefuse || isRefusing || isDisputing || isMerging;
  const responsiveClass = onlyMerge ? "d-block d-xl-none" : "d-none d-xl-block";

  return (
    <>
      <div className="row justify-content-center justify-content-xl-between gap-2">
        <If condition={isAbleToMerge}>
          <div className={`col-12 col-xl ${responsiveClass}`}>
            <div className="row">
              <ProposalMerge
                amountTotal={issueAmount}
                token={token}
                isMerging={isMerging}
                idBounty={issueDbId}
                canMerge={isAbleToMerge && !isRefusing && !isDisputing && canCloseTask}
                distributedAmounts={distributedAmounts}
                onClickMerge={onMerge}
              />
            </div>
          </div>
        </If>

        <If condition={isAbleToDispute && !onlyMerge}>
          <div className="col-12 col-xl">
            <div className="row">
              <ContractButton
                textClass="text-uppercase text-white"
                color="purple"
                disabled={isDisputeButtonDisabled}
                onClick={onDispute}
                isLoading={isDisputing}
                withLockIcon={!isAbleToDispute || isMerging || isRefusing}
                data-testid="dispute-btn"
              >
                <span>{t("actions.dispute")}</span>
              </ContractButton>
            </div>
          </div>
        </If>

        <If condition={isAbleToRefuse && !onlyMerge}>
          <div className="col-12 col-xl">
            <div className="row">
              <ContractButton
                textClass="text-uppercase text-white"
                color="danger"
                disabled={isRefuseButtonDisabled}
                onClick={onRefuse}
                isLoading={isRefusing}
                withLockIcon={isDisputing || isMerging}
                data-testid="refuse-btn"
              >
                <span>{t("actions.refuse")}</span>
              </ContractButton>
            </div>
          </div>
        </If>
      </div>

      <If condition={!canCloseTask}>
        <div className="row mt-2">
          <ContextualSpan context="info">
            {t("closing-task-list-warning")}
          </ContextualSpan>
        </div>
      </If>
    </>
  );
}