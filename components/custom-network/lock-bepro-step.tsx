import {useEffect, useState} from "react";
import {ProgressBar} from "react-bootstrap";

import BigNumber from "bignumber.js";
import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import ArrowRightLine from "assets/icons/arrow-right-line";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import AmountWithPreview from "components/custom-network/amount-with-preview";
import InputNumber from "components/input-number";
import Step from "components/step";
import UnlockBeproModal from "components/unlock-bepro-modal";

import {useNetworkSettings} from "contexts/network-settings";

import {UNSUPPORTED_CHAIN} from "helpers/constants";
import {formatNumberToCurrency, formatNumberToNScale} from "helpers/formatNumber";
import {parseTransaction} from "helpers/transactions";

import {CustomSession} from "interfaces/custom-session";
import { RegistryEvents } from "interfaces/enums/events";
import {TransactionStatus} from "interfaces/enums/transaction-status";
import {TransactionTypes} from "interfaces/enums/transaction-types";
import {StepWrapperProps} from "interfaces/stepper";
import {SimpleBlockTransactionPayload} from "interfaces/transaction";

import {UserRoleUtils} from "server/utils/jwt";

import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import {transactionStore} from "x-hooks/stores/transaction-list/transaction.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import {useAuthentication} from "x-hooks/use-authentication";
import useBepro from "x-hooks/use-bepro";
import useERC20 from "x-hooks/use-erc20";
import useSupportedChain from "x-hooks/use-supported-chain";

export default function LockBeproStep({ activeStep, index, handleClick, validated }: StepWrapperProps) {
  const session = useSession();
  const { t } = useTranslation(["common", "bounty","custom-network"]);

  const [inputError, setInputError] = useState("")
  const [amount, setAmount] = useState<BigNumber>();
  const [isLocking, setIsLocking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showUnlockBepro, setShowUnlockBepro] = useState(false);
  const [hasNetworkRegistered, setHasNetworkRegistered] = useState(false);

  const registryToken = useERC20();
  const { processEvent } = useProcessEvent();
  const { connectedChain } = useSupportedChain();
  const { updateWalletBalance } = useAuthentication();
  const { tokensLocked, updateTokenBalance } = useNetworkSettings();
  const { lockInRegistry, approveTokenInRegistry, unlockFromRegistry } = useBepro();

  const { currentUser } = useUserStore();
  const { add: addTx, update: updateTx } = transactionStore();
  const { service: daoService, ...daoStore } = useDaoStore();

  const registryTokenSymbol = registryToken.symbol || t("misc.$token");

  const balance = {
    beproAvailable: registryToken.balance,
    oraclesAvailable: 
      currentUser?.balance?.oracles?.locked?.minus(currentUser?.balance?.oracles?.delegatedToOthers),
    tokensLocked: currentUser?.balance?.oracles?.locked?.toFixed(),
  };

  const amountLocked = BigNumber(tokensLocked.locked);
  const amountNeeded = BigNumber(tokensLocked.needed);

  const lockedPercent = amountLocked?.multipliedBy(100)?.dividedBy(amountNeeded);
  const lockingPercent = amount?.multipliedBy(100)?.dividedBy(amountNeeded);
  const maxPercent = BigNumber(100).minus(lockedPercent).toFixed(4);
  const maxValue = BigNumber.minimum(balance.beproAvailable, amountNeeded?.minus(amountLocked));
  const textAmountClass = amount?.gt(balance.beproAvailable) ? "danger" : "primary";
  const amountsClass = amount?.gt(maxValue) ? "danger" : "success";
  const needsAllowance = amount?.gt(registryToken.allowance);
  const isLockBtnDisabled = [
    !amount,
    amount?.isZero(),
    amount?.isNaN(),
    lockedPercent?.gte(100),
    amount?.gt(maxValue)
  ].some(c => c);
  const isUnlockBtnDisabled = 
    lockedPercent?.isZero() || lockedPercent?.isNaN() || !!hasNetworkRegistered;
  const isAmountInputDisabled = !!lockedPercent?.gte(100) || !!hasNetworkRegistered;

  const failTx = (err, tx) => {

    updateTx({
      ...tx,
      status: err?.message?.search("User denied") > -1 ? TransactionStatus.rejected : TransactionStatus.failed
    });

    console.error("Tx error", err);
  }

  async function handleLock() {
    if (!daoService || !amount) return;

    const lockTxAction = addTx({
      type: TransactionTypes.lock,
      amount: amount.toFixed(),
      currency: registryTokenSymbol
    });


    setIsLocking(true);

    lockInRegistry(amount.toFixed())
      .then((tx) => {
        updateWalletBalance();
        registryToken.updateAllowanceAndBalance();
        setAmount(BigNumber(0));
        updateTx(parseTransaction(tx, lockTxAction as SimpleBlockTransactionPayload));
        updateTokenBalance()
        return processEvent(RegistryEvents.UserLockedAmountChanged, connectedChain?.registry, {
          fromBlock: tx.blockNumber
        })
      })
      .catch((error) => {
        failTx(error, lockTxAction)
      })
      .finally(() => setIsLocking(false));
  }

  async function handleUnLock() {
    if (!daoService) return;

    const unlockTxAction = addTx({
      type: TransactionTypes.unlock,
      amount: amountLocked.toFixed(),
      currency: t("$oracles", { token: registryTokenSymbol })  
    })

    setIsUnlocking(true);

    unlockFromRegistry()
      .then((tx) => {
        updateWalletBalance();
        registryToken.updateAllowanceAndBalance();
        setAmount(BigNumber(0));
        updateTx(parseTransaction(tx, unlockTxAction as SimpleBlockTransactionPayload));
        updateTokenBalance();
        return processEvent(RegistryEvents.UserLockedAmountChanged, connectedChain?.registry, {
          fromBlock: tx.blockNumber
        })
      })
      .catch((error) => {
        failTx(error, unlockTxAction);
        console.log("Failed to Unlock", error);
      })
      .finally(() => setIsUnlocking(false));
  }

  function handleShowUnlockModal() {
    setShowUnlockBepro(true);
  }

  function handleCloseUnlockModal() {
    setShowUnlockBepro(false);
  }

  function handleAmountChange(params) {
    const newValue = BigNumber(params.value);
    
    if(newValue.gt(balance.beproAvailable))
      setInputError(t("bounty:errors.exceeds-allowance"))
    else if(inputError)
      setInputError("")
      
    setAmount(params.value !== "" && newValue || undefined);
  }

  function handleSetMaxValue() {
    if (lockedPercent?.lt(100) && !isAmountInputDisabled) setAmount(maxValue);
  }

  function handleApproval() {
    if (amountNeeded?.lte(0) || isApproving) return;

    const approveTxAction =
      addTx({ type: TransactionTypes.approveTransactionalERC20Token } as SimpleBlockTransactionPayload);

    setIsApproving(true);

    approveTokenInRegistry(amount?.toFixed())
      .then((tx) => {
        registryToken.updateAllowanceAndBalance();
        updateTx(parseTransaction(tx, approveTxAction as SimpleBlockTransactionPayload));
      })
      .catch((err) => {
        failTx(err, approveTxAction);
      })
      .finally(()=> setIsApproving(false));
  }

  useEffect(() => {
    const tokenAddress = daoService?.registry?.token?.contractAddress;
    const registryAddress = daoService?.registry?.contractAddress;

    if (tokenAddress &&
        registryAddress &&
        connectedChain?.name !== UNSUPPORTED_CHAIN &&
        +connectedChain?.id === +daoStore?.chainId &&
        !daoStore?.serviceStarting &&
        !!daoService) {
      registryToken.setAddress(tokenAddress);
      registryToken.setSpender(registryAddress);
      return;
    }
    registryToken.setAddress(null);
    registryToken.setSpender(null);
  }, [
    daoStore?.chainId,
    daoService
  ]);

  useEffect(() => {
    if (session.status !== "authenticated" || !connectedChain?.id) return;

    const userRoles = (session.data as CustomSession).user.roles;
    setHasNetworkRegistered(UserRoleUtils.isGovernorOnChain(userRoles, connectedChain?.id));
  }, [session, connectedChain?.id]);

  return (
    <Step
      title={t("custom-network:steps.lock.title", { currency: registryTokenSymbol })}
      index={index}
      activeStep={activeStep}
      validated={validated}
      handleClick={handleClick}
    >
      <>
        <div className="row mb-4">
          <span className="caption-small text-gray">
            {t("custom-network:steps.lock.you-need-to-lock", {
              creatorAmount: formatNumberToNScale(amountNeeded?.toNumber()),
              currency: registryTokenSymbol,
            })}
          </span>
        </div>

        <div className="row mx-0 mb-4">
          <div className="col mr-3">
            <div className="row mb-3 mx-0">
              <div className="col px-0">
                <div className="row mb-2">
                  <label htmlFor="" className="caption-medium text-gray">
                    <span className="text-primary">{registryTokenSymbol}</span>{" "}
                    {t("transactions.amount")}
                  </label>
                </div>

                <div className="row bg-dark-gray border-radius-8 amount-input">
                  <div className="col px-0">
                    <InputNumber
                      classSymbol={"text-primary"}
                      data-testid="amount-input"
                      max={maxValue?.toFixed()}
                      value={amount?.toFixed()}
                      error={amount?.gt(maxValue) || !!inputError}
                      setMaxValue={handleSetMaxValue}
                      min={0}
                      placeholder={"0"}
                      disabled={isAmountInputDisabled}
                      thousandSeparator
                      decimalSeparator="."
                      decimalScale={18}
                      onValueChange={handleAmountChange}
                      helperText={
                        <>
                          {inputError && (
                            <p className="p-small my-2 mx-2">{inputError}</p>
                          )}
                        </>
                      }
                    />

                    <div className="d-flex caption-small justify-content-between align-items-center p-3 mt-1 mb-1">
                      <span className="text-light-gray">
                        <span className="text-primary">
                          {registryTokenSymbol}
                        </span>{" "}
                        {t("misc.available")}
                      </span>

                      <div className="d-flex align-items-center flex-wrap">
                        <span className="text-gray">
                          {formatNumberToNScale(balance?.beproAvailable?.toNumber() || 0)}
                        </span>

                        {amount?.gt(0) && (
                          <>
                            <span
                              className={`${textAmountClass} ml-1 d-flex align-items-center`}
                            >
                              <ArrowRightLine />
                            </span>

                            <span className={`${textAmountClass} ml-1`}>
                              {formatNumberToNScale(balance?.beproAvailable
                                  ?.minus(amount)
                                  ?.toNumber())}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {balance?.oraclesAvailable?.gt(0) && lockedPercent?.lt(100) && (
                  <>
                    <div className="row mt-4">
                      <p className="caption-small text-gray">
                        {t("transactions.types.unlock")}{" "}
                        <span className="text-primary">
                          {registryTokenSymbol}
                        </span>{" "}
                        {t("misc.by")} {t("misc.giving-away")}{" "}
                        <span className="text-purple">
                          {t("$oracles", { token: registryTokenSymbol })}
                        </span>
                      </p>
                    </div>

                    <div
                      className={`row mt-2 bg-dark-gray bg-dark-hover cursor-pointer 
                            border-radius-8 caption-small p-3`}
                      onClick={handleShowUnlockModal}
                    >
                      <div className="d-flex justify-content-between px-0">
                        <span className="text-light-gray">
                          <span className="text-purple text-uppercase">
                            {t("$oracles", { token: registryTokenSymbol })}
                          </span>{" "}
                          {t("misc.available")}
                        </span>

                        <span className="text-gray">
                          {formatNumberToCurrency(balance?.oraclesAvailable?.toNumber() || 0,
                                                  {
                              maximumFractionDigits: 18,
                                                  })}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col bg-dark-gray border-radius-8 p-3 mr-3">
            <p className="caption-medium text-gray mb-4">
              <span className="text-primary">{registryTokenSymbol}</span>{" "}
              {t("misc.locked")}
            </p>
            <div className="d-flex justify-content-between caption-large mb-3 amount-input">
              <AmountWithPreview
                amount={amountLocked?.toFixed()}
                amountColor={(lockedPercent?.gte(100) && "success") || "white"}
                preview={amountLocked?.plus(amount || 0)?.toFixed()}
                previewColor={amountsClass}
                type="currency"
              />

              <AmountWithPreview
                amount={
                  (lockedPercent?.gte(100) &&
                    t("custom-network:steps.lock.full")) ||
                  amountNeeded?.toFixed()
                }
                amountColor={(lockedPercent?.gte(100) && "success") || "gray"}
                type="currency"
              />
            </div>

            <div className="row justify-content-between caption-large mb-3">
              <ProgressBar>
                <ProgressBar
                  variant={amountsClass}
                  now={
                    lockingPercent?.gt(maxPercent)
                      ? 100
                      : lockedPercent?.toNumber()
                  }
                  isChild
                />

                <ProgressBar
                  min={0}
                  now={
                    (lockingPercent?.gt(maxPercent)
                      ? 0
                      : lockingPercent?.toNumber()) || 0
                  }
                  isChild
                />
              </ProgressBar>
            </div>

            <div className="d-flex align-items-center caption-large amount-input">
              <AmountWithPreview
                amount={lockedPercent?.toFixed()}
                amountColor={(lockedPercent?.gte(100) && "success") || "white"}
                preview={lockingPercent?.plus(lockedPercent)?.toFixed()}
                previewColor={amountsClass}
                type="percent"
              />
            </div>

            <div className="d-flex justify-content-center mt-4 pt-3">
              {(needsAllowance && (
                <ContractButton
                  disabled={isApproving || !!lockingPercent?.gt(100)}
                  onClick={handleApproval}
                  variant="registry"
                  data-testid="approve-btn"
                >
                  {t("actions.approve")}
                  {isApproving && (
                    <span className="spinner-border spinner-border-xs ml-1" />
                  )}
                </ContractButton>
              )) || (
                <ContractButton
                  disabled={isLockBtnDisabled || isLocking}
                  onClick={() => handleLock()}
                  isLoading={isLocking}
                  withLockIcon={!isLocking && isLockBtnDisabled}
                  variant="registry"
                  data-testid="lock-btn"
                >
                  <span>
                    {t("transactions.types.lock")} {registryTokenSymbol}
                  </span>
                </ContractButton>
              )}

              <ContractButton
                disabled={
                  isUnlockBtnDisabled || isUnlocking || isApproving || isLocking
                }
                color="light-gray"
                onClick={handleUnLock}
                isLoading={isUnlocking}
                withLockIcon={!isUnlocking && isUnlockBtnDisabled}
                variant="registry"
                data-testid="unlock-btn"
              >
                <span>{t("transactions.types.unlock")}</span>
              </ContractButton>
            </div>
          </div>
        </div>
      </>

      <UnlockBeproModal
        show={showUnlockBepro}
        onCloseClick={handleCloseUnlockModal}
        networkTokenSymbol={registryTokenSymbol}
      />
    </Step>
  );
}
