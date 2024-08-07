import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import Button from "components/button";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import Modal from "components/modal";

import { formatStringToCurrency } from "helpers/formatNumber";

import { DistributionsProps } from "interfaces/proposal";

import { useERC20 } from "x-hooks/use-erc20";

import AmountTokenInformation from "../amount-token-information/view";

interface UpdateBountyAmountModalViewProps {
  show: boolean;
  needsApproval: boolean;
  isExecuting: boolean;
  exceedsBalance: boolean;
  transactionalERC20: useERC20;
  rewardAmount: NumberFormatValues;
  issueAmount: NumberFormatValues;
  taskAmount?: BigNumber;
  inputError: string;
  isSameValue?: boolean;
  distributions: DistributionsProps;
  minimum: string;
  onIssueAmountValueChange: (
    values: NumberFormatValues,
    type: "reward" | "total"
  ) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  handleApprove: () => void;
}

export default function UpdateBountyAmountModalView({
  show,
  needsApproval,
  isExecuting,
  exceedsBalance,
  transactionalERC20,
  rewardAmount,
  issueAmount,
  inputError,
  distributions,
  taskAmount,
  isSameValue,
  minimum,
  onIssueAmountValueChange,
  handleSubmit,
  handleClose,
  handleApprove,
}: UpdateBountyAmountModalViewProps) {
  const { t } = useTranslation(["common", "bounty"]);

  const isApproveButtonDisabled = isExecuting || exceedsBalance;
  const isConfirmButtonDisabled =  isExecuting || exceedsBalance || !issueAmount || !!inputError || !!isSameValue;

  return (
    <Modal
      show={show}
      onCloseClick={handleClose}
      title={t("modals.update-bounty-amount.title")}
      titlePosition="center"
      footer={
        <div className="d-flex pt-2 justify-content-between">
          <Button
            color="gray-800"
            className={`border-radius-4 border border-gray-700 sm-regular text-capitalize font-weight-medium py-2 px-3`}
            data-testid="update-amount-modal-cancel-btn"
            onClick={handleClose}
          >
            {t("actions.cancel")}
          </Button>
          {needsApproval ? (
            <ContractButton
              onClick={handleApprove}
              disabled={isApproveButtonDisabled}
              className={`border-radius-4 border border-${isApproveButtonDisabled ? "gray-700" : "primary"} 
                  sm-regular text-capitalize font-weight-medium py-2 px-3`}
              withLockIcon={exceedsBalance}
              isLoading={isExecuting}
              data-testid="update-amount-modal-approve-btn"
            >
              <span>{t("actions.approve")}</span>
            </ContractButton>
          ) : (
            <ContractButton
              disabled={isConfirmButtonDisabled}
              withLockIcon={exceedsBalance || !issueAmount || !!inputError || !!isSameValue}
              className={`border-radius-4 border border-${isConfirmButtonDisabled ? "gray-700" : "primary"} 
                  sm-regular text-capitalize font-weight-medium py-2 px-3`}
              onClick={handleSubmit}
              isLoading={isExecuting}
              data-testid="update-amount-modal-confirm-btn"
            >
              <span>{t("actions.confirm")}</span>
            </ContractButton>
          )}
        </div>
      }
    >
      <div className="container">
        <AmountTokenInformation
          isFunding={false}
          currentToken={{
            name: transactionalERC20.name,
            symbol: transactionalERC20.symbol,
            address: transactionalERC20.address,
            minimum
          }}
          rewardAmount={rewardAmount}
          issueAmount={issueAmount}
          tokenBalance={transactionalERC20.balance}
          decimals={transactionalERC20.decimals}
          inputError={inputError}
          distributions={distributions}
          onIssueAmountValueChange={onIssueAmountValueChange}
          classNameInputs="col-md-6 col-12 mt-1"
        />

        <div className="d-flex justify-content-end">
          <span className="text-gray me-1">{t("bounty:your-balance")}: </span>
          {formatStringToCurrency(transactionalERC20.balance.toFixed(2))}{" "}
          {transactionalERC20.symbol}
        </div>

        <div className="d-flex justify-content-end">
          <span className="text-gray me-1">{t("bounty:locked-in-the-task")}:</span>
          {formatStringToCurrency(taskAmount.toFixed(2))}{" "}
          {transactionalERC20.symbol}
        </div>

        <div className="d-flex justify-content-end">
          <span className="text-gray me-1">{t("bounty:available")}:</span>
          {formatStringToCurrency(transactionalERC20.balance.gt(0) ? 
            taskAmount.plus(transactionalERC20.balance).toFixed(2) : "0.00")}{" "}
          {transactionalERC20.symbol}
        </div>
      </div>
    </Modal>
  );
}
