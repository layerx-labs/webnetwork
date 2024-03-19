import React from "react";

import {useTranslation} from "next-i18next";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import NetworkTxButton from "components/common/network-tx-button/controller";
import If from "components/If";
import InputNumber from "components/input-number";
import OraclesBoxHeader from "components/profile/pages/voting-power/oracles/box-header/view";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

import { formatStringToCurrency} from "helpers/formatNumber";

import {TransactionTypes} from "interfaces/enums/transaction-types";
import { OraclesActionsViewProps } from "interfaces/oracles-state";

import ModalOraclesActionView from "./modal-actions/view";

export default function OraclesActionsView({
  disabled,
  isBalanceLoading,
  wallet,
  actions,
  action,
  handleAction,
  renderInfo,
  currentLabel,
  networkTokenSymbol,
  error,
  tokenAmount,
  handleChangeToken,
  networkTokenDecimals,
  getMaxAmount,
  handleMaxAmount,
  needsApproval,
  isApproving,
  approveSettlerToken,
  verifyTransactionState,
  isButtonDisabled,
  handleCheck,
  txType,
  handleProcessEvent,
  onSuccess,
  handleError,
  networkTxRef,
  show,
  handleCancel,
  handleConfirm
} : OraclesActionsViewProps) {
  const { t } = useTranslation(["common", "my-oracles"]);

  return (
    <>
      <div className="mt-2 col-md-6">
        <div className="bg-gray-950 border border-gray-800 border-radius-4 p-4 h-100">
          <OraclesBoxHeader
            actions={actions}
            onChange={handleAction}
            currentAction={action}
          />

          <p className="caption-small text-gray-500 font-weight-500 text-uppercase mt-2 mb-4">
            {renderInfo?.description}
          </p>

          <InputNumber
            disabled={disabled || !wallet?.address}
            className="bg-gray-850"
            label={t("my-oracles:fields.amount.label", {
              currency: currentLabel
            })}
            symbol={`${currentLabel}`}
            classSymbol={`bg-gray-850 ${
              currentLabel === t("$oracles", { token: networkTokenSymbol })
                ? "text-purple"
                : "text-primary"
            }`}
            data-testid="oracle-actions-input"
            max={wallet?.balance?.bepro?.toFixed()}
            error={!!error}
            value={tokenAmount}
            min={0}
            placeholder={t("my-oracles:fields.amount.placeholder", {
              currency: currentLabel
            })}
            onValueChange={handleChangeToken}
            thousandSeparator
            decimalSeparator="."
            allowNegative={false}
            decimalScale={networkTokenDecimals}
            helperText={
              <If
                condition={!isBalanceLoading}
                otherwise={
                  <span className="spinner-border spinner-border-xs ml-1" />
                }
              >
                <If condition={!disabled}>
                  {formatStringToCurrency(getMaxAmount())}{" "}
                  {currentLabel} {t("misc.available")}
                  <span 
                    onClick={handleMaxAmount}
                    role="button"
                    data-testid="oracles-actions-max-button"
                    className={`caption-small ml-1 cursor-pointer text-uppercase ${(
                      currentLabel === t("$oracles", { token: networkTokenSymbol })
                        ? "text-purple"
                        : "text-primary"
                    )}`}
                  >
                    {t("misc.max")}
                  </span>
                  {error && <p className="p-small my-2">{error}</p>}
                </If>
              </If>
            }
          />

          <ReadOnlyButtonWrapper>
            <div className="mt-5 d-grid gap-3">
              {action === t("my-oracles:actions.lock.label") && (
                <ContractButton
                  disabled={disabled || !needsApproval || isApproving}
                  withLockIcon={disabled || !needsApproval}
                  isLoading={isApproving || verifyTransactionState(TransactionTypes.approveSettlerToken)}
                  className="ms-0 read-only-button mt-3"
                  onClick={approveSettlerToken}
                  data-testid="approve-btn"
                >
                  <span>
                    {t("actions.approve")}
                  </span>
                </ContractButton>
              )}

              <ContractButton
                color={
                  action === t("my-oracles:actions.lock.label")
                    ? "purple"
                    : "primary"
                }
                data-testid="get-votes-btn"
                className="ms-0 read-only-button"
                disabled={disabled || isButtonDisabled}
                withLockIcon={disabled || isButtonDisabled}
                onClick={handleCheck}
              >
                <span>{renderInfo?.label}</span>
              </ContractButton>
            </div>
          </ReadOnlyButtonWrapper>

          <NetworkTxButton
            txMethod={action.toLowerCase()}
            txType={txType}
            txCurrency={currentLabel}
            handleEvent={handleProcessEvent}
            txParams={renderInfo?.params(wallet?.address)}
            buttonLabel=""
            modalTitle={renderInfo?.title}
            modalDescription={renderInfo?.description}
            onSuccess={onSuccess}
            onFail={handleError}
            buttonConfirmRef={networkTxRef}
          />
        </div>
      </div>

      <ModalOraclesActionView 
        renderInfo={renderInfo} 
        show={show} 
        handleCancel={handleCancel} 
        handleConfirm={handleConfirm}      
      />
    </>
  );
}