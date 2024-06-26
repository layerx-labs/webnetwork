import {ChangeEvent, useEffect, useRef, useState} from "react";
import {NumberFormatValues} from "react-number-format";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import OraclesDelegateView from "components/profile/pages/voting-power/oracles/delegate/view";

import {NetworkEvents} from "interfaces/enums/events";
import {TransactionStatus} from "interfaces/enums/transaction-status";
import {TransactionTypes} from "interfaces/enums/transaction-types";
import {OraclesDelegateProps} from "interfaces/oracles-state";

import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import {transactionStore} from "x-hooks/stores/transaction-list/transaction.store";
import useBepro from "x-hooks/use-bepro";
import useMarketplace from "x-hooks/use-marketplace";

export default function OraclesDelegate({
  isBalanceLoading,
  disabled,
  wallet,
  updateWalletBalance,
  defaultAddress,
}: OraclesDelegateProps) {
  const { t } = useTranslation(["common", "my-oracles"]);

  const debounce = useRef(null);

  const [error, setError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState<string>();
  const [delegatedTo, setDelegatedTo] = useState<string>(defaultAddress || "");
  const [availableAmount, setAvailableAmount] = useState<BigNumber>();

  const marketplace = useMarketplace();
  const { processEvent } = useProcessEvent();
  const { isAddress } = useBepro();
  const {list: transactions} = transactionStore();

  const networkTokenDecimals = marketplace?.active?.networkToken?.decimals || 18;
  const networkTokenSymbol = marketplace?.active?.networkToken?.symbol;
  const isMarketplaceClosed = marketplace?.active?.isClosed;

  function handleChangeOracles(params: NumberFormatValues) {
    if (params.value === "") return setTokenAmount("");

    if (availableAmount.lt(params.value))
      setError(t("my-oracles:errors.amount-greater", { amount: "total" }));
    else setError("");

    setTokenAmount(params.value);
  }

  function setMaxAmount() {
    if (disabled)
      return;
    return setTokenAmount(availableAmount.toFixed());
  }

  function handleChangeAddress(params: ChangeEvent<HTMLInputElement>) {
    if (addressError) setAddressError("");
    setDelegatedTo(params.target.value);

    if (params.target.value) {
      clearTimeout(debounce.current);

      debounce.current = setTimeout(() => {
        if (!isAddress(params.target.value)) setAddressError(t("my-oracles:errors.invalid-wallet"));
      }, 500);
    }
  }

  function handleClickVerification() {
    if (!tokenAmount || !delegatedTo) {
      return setError(t("my-oracles:errors.fill-required-fields"));
    }
  }

  function handleTransition() {
    updateWalletBalance();
    handleChangeOracles({ floatValue: 0, formattedValue: "", value: "" });
    setDelegatedTo("");
    setError("");
  }

  function handleProcessEvent(blockNumber) {
    return processEvent(NetworkEvents.OraclesTransfer, undefined, {
      fromBlock: blockNumber,
    })
      .then(() => updateWalletBalance())
      .catch(console.debug);
  }

  const isButtonDisabled = (): boolean =>
    [
      wallet?.balance?.oracles?.locked?.lt(tokenAmount),
      !delegatedTo,
      disabled,
      isMarketplaceClosed,
      isAddressesEqual(),
      BigNumber(tokenAmount).isZero(),
      BigNumber(tokenAmount).isNaN(),
      addressError,
      error,
      transactions.find(({ status, type }) =>
          status === TransactionStatus.pending &&
          type === TransactionTypes.delegateOracles),
    ].some((values) => values);

  const isAddressesEqual = () =>
    wallet?.address &&
    delegatedTo?.toLowerCase() === wallet?.address?.toLowerCase();

  useEffect(() => {
    if (!wallet?.balance?.oracles) return;

    setAvailableAmount(wallet?.balance?.oracles?.locked || BigNumber("0"));
  }, [wallet?.balance?.oracles?.locked]);

  return (
    <OraclesDelegateView
      isBalanceLoading={isBalanceLoading}
      disabled={disabled || isMarketplaceClosed}
      tokenAmount={tokenAmount}
      handleChangeOracles={handleChangeOracles}
      error={error}
      networkTokenDecimals={networkTokenDecimals}
      availableAmount={availableAmount}
      handleMaxAmount={setMaxAmount}
      delegatedTo={delegatedTo}
      handleChangeAddress={handleChangeAddress}
      isAddressesEqual={isAddressesEqual()}
      addressError={addressError}
      networkTokenSymbol={networkTokenSymbol}
      handleClickVerification={handleClickVerification}
      handleProcessEvent={handleProcessEvent}
      handleTransition={handleTransition}
      handleError={setError}
      isButtonDisabled={isButtonDisabled()}
    />
  );
}