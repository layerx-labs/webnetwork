import { useEffect, useState } from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import { useDebouncedCallback } from "use-debounce";

import calculateDistributedAmounts, { calculateTotalAmountFromGivenReward } from "helpers/calculateDistributedAmounts";

import { NetworkEvents } from "interfaces/enums/events";
import { IssueBigNumberData } from "interfaces/issue-data";
import { DistributionsProps } from "interfaces/proposal";

import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useBepro from "x-hooks/use-bepro";
import useERC20 from "x-hooks/use-erc20";
import useMarketplace from "x-hooks/use-marketplace";

import UpdateBountyAmountModalView from "./view";

const ZeroNumberFormatValues = {
  value: "",
  formattedValue: "",
  floatValue: 0,
};
interface UpdateBountyAmountModalProps {
  show: boolean;
  bounty: IssueBigNumberData;
  handleClose: () => void;
  updateBountyData: () => void;
}

export default function UpdateBountyAmountModal({
  show,
  bounty,
  handleClose = undefined,
  updateBountyData,
}: UpdateBountyAmountModalProps) {
  const { t } = useTranslation(["common", "bounty"]);

  const [inputError, setInputError] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [distributions, setDistributions] = useState<DistributionsProps>();
  const [rewardAmount, setRewardAmount] = useState<NumberFormatValues>(ZeroNumberFormatValues);
  const [issueAmount, updateIssueAmount] = useState<NumberFormatValues>(ZeroNumberFormatValues);

  const { currentUser } = useUserStore();
  const { addError } = useToastStore();
  const { service: daoService } = useDaoStore();
  const marketplace = useMarketplace();
  const transactionalERC20 = useERC20();
  const { processEvent } = useProcessEvent();
  const { handleApproveToken, handleUpdateBountyAmount } = useBepro();

  const currentToken = {
    currentValue: transactionalERC20.totalSupply.toNumber(),
    minimum: transactionalERC20.minimum,
  };

  const debouncedDistributionsUpdater = useDebouncedCallback((value, type) => handleDistributions(value, type), 500);

  const amountIsGtBalance = (v: string | number, balance: BigNumber) => BigNumber(v).gt(balance);

  const transactionalAddress = bounty?.transactionalToken?.address;
  const bountyId = bounty?.contractId;
  const walletBalanceWithTaskAmount = transactionalERC20.balance?.plus(bounty?.amount);
  const totalAmountMinusBountyAmount = BigNumber(issueAmount.formattedValue).minus(bounty?.amount);
  const isIncreasingAmount = BigNumber(issueAmount.formattedValue)?.gt(bounty?.amount);
  const needsApproval = 
    isIncreasingAmount ? !!totalAmountMinusBountyAmount?.gt(transactionalERC20.allowance) : false;
  const exceedsBalance = !!BigNumber(issueAmount.formattedValue)?.gt(walletBalanceWithTaskAmount);
  const isSameValue = BigNumber(issueAmount.formattedValue)?.eq(bounty?.amount);

  function onCloseModalClick() {
    resetValues();
    handleClose();
  }

  const resetValues = () => {
    updateIssueAmount(ZeroNumberFormatValues);
    setRewardAmount(ZeroNumberFormatValues);
    setDistributions(undefined);
    setInputError(undefined);
  };

  const handleApprove = async () => {
    setIsExecuting(true);

    handleApproveToken( transactionalAddress,
                        BigNumber(issueAmount.formattedValue)
                          .minus(bounty?.amount)
                          .decimalPlaces(Math.min(10, transactionalERC20?.decimals), 0)
                          .toFixed(),
                        undefined,
                        transactionalERC20?.symbol)
      .then(() => {
        return transactionalERC20.updateAllowanceAndBalance();
      })
      .catch((error) => {
        addError("Failed to approve", error.toString());
      })
      .finally(() => {
        setIsExecuting(false);
      });
  };

  const handleSubmit = async () => {
    setIsExecuting(true);

    handleUpdateBountyAmount( bountyId,
                              issueAmount.formattedValue,
                              transactionalERC20?.symbol,
                              transactionalERC20?.decimals)
      .then((txInfo) => {
        return processEvent(NetworkEvents.BountyUpdated, undefined, {
          fromBlock: (txInfo as { blockNumber: number }).blockNumber,
        });
      })
      .then(() => {
        updateBountyData();
        resetValues();
        handleClose();
      })
      .catch(console.log)
      .finally(() => {
        setIsExecuting(false);
      });
  };

  const handleNumberFormat = (v: BigNumber) => ({
    value: v.decimalPlaces(5, 0).toFixed(),
    floatValue: v.toNumber(),
    formattedValue: v.decimalPlaces(Math.min(10, transactionalERC20?.decimals), 0).toFixed()
  });


  function handleDistributions(value, type) {
    if (!marketplace?.active) return;
    if (!value) {
      setDistributions(undefined);
      if (type === "reward")
        updateIssueAmount(ZeroNumberFormatValues);
      else
        setRewardAmount(ZeroNumberFormatValues);
      return;
    }

    const { chain, mergeCreatorFeeShare, proposerFeeShare } = marketplace?.active || {};
    const amountOfType =
      BigNumber(type === "reward"
        ? calculateTotalAmountFromGivenReward(value, 
                                              +chain.closeFeePercentage/100,
                                              +mergeCreatorFeeShare/100,
                                              +proposerFeeShare/100)
        : value);

    const initialDistributions = calculateDistributedAmounts( chain.closeFeePercentage,
                                                              mergeCreatorFeeShare,
                                                              proposerFeeShare,
                                                              amountOfType,
                                                              [
                                                                { 
                                                                  recipient: currentUser?.walletAddress, 
                                                                  percentage: 100 
                                                                }
                                                              ]);

    const { mergerAmount, proposerAmount, treasuryAmount } =
      initialDistributions;

    const mergerAmountValue = new BigNumber(mergerAmount.value);
    const proposerAmountValue = new BigNumber(proposerAmount.value);
    const treasuryAmountValue = new BigNumber(treasuryAmount.value);

    const totalServiceFees =
      mergerAmountValue.plus(proposerAmountValue).plus(treasuryAmountValue) ||
      BigNumber(0);

    const distributions = { totalServiceFees, ...initialDistributions };

    if (type === "reward") {
      const total = totalServiceFees.plus(rewardAmount?.value);
      updateIssueAmount(handleNumberFormat(total));
      amountIsGtBalance(total.toNumber(), walletBalanceWithTaskAmount) &&
        setInputError(t("bounty:errors.exceeds-balance"));
    }

    if (type === "total") {
      const rewardValue = BigNumber(issueAmount?.value).minus(totalServiceFees);
      setRewardAmount(handleNumberFormat(rewardValue));
    }

    setDistributions(distributions);
  }

  function handleIssueAmountOnValueChange(values: NumberFormatValues, type: "reward" | "total") {
    const setType = type === "reward" ? setRewardAmount : updateIssueAmount;

    if (amountIsGtBalance(values.floatValue, walletBalanceWithTaskAmount)) {
      setInputError(t("bounty:errors.exceeds-available"));
      setType(values);
    } else if (+values.floatValue > +currentToken?.currentValue) {
      setType(ZeroNumberFormatValues);
      setInputError(t("bounty:errors.exceeds-allowance"));
    } else if (values.floatValue < 0) {
      setType(ZeroNumberFormatValues);
    } else if (
      values.floatValue !== 0 &&
      BigNumber(values.floatValue).isLessThan(BigNumber(currentToken?.minimum))
    ) {
      setType(handleNumberFormat(BigNumber(values.value)));
      setInputError(t("bounty:errors.exceeds-minimum-amount", {
          amount: currentToken?.minimum,
      }));
    } else {
      debouncedDistributionsUpdater(values.value, type);
      setType(handleNumberFormat(BigNumber(values.value)));
      if (inputError) setInputError("");
    }
  }

  function handleUpdateToken() {
    if (issueAmount?.floatValue === 0) return;

    if (
      BigNumber(issueAmount?.floatValue).isLessThan(BigNumber(currentToken?.minimum))
    ) {
      setInputError(t("bounty:errors.exceeds-minimum-amount", {
          amount: currentToken?.minimum,
      }));
    } else setInputError("");
  }

  useEffect(() => {
    if (issueAmount?.value && !rewardAmount?.value) {
      debouncedDistributionsUpdater(issueAmount.value, "total");
    }
  }, [issueAmount]);

  useEffect(handleUpdateToken, [currentToken?.minimum]);

  useEffect(() => {
    if (
      !transactionalAddress ||
      !daoService ||
      !currentUser?.walletAddress ||
      !show
    )
      return;

    transactionalERC20.setAddress(transactionalAddress);
    transactionalERC20.updateAllowanceAndBalance();
  }, [transactionalAddress, daoService, currentUser, show]);

  return (
    <UpdateBountyAmountModalView
      show={show}
      needsApproval={needsApproval}
      isExecuting={isExecuting}
      exceedsBalance={exceedsBalance}
      transactionalERC20={transactionalERC20}
      handleSubmit={handleSubmit}
      handleClose={onCloseModalClick}
      handleApprove={handleApprove} 
      rewardAmount={rewardAmount} 
      issueAmount={issueAmount} 
      inputError={inputError} 
      distributions={distributions} 
      taskAmount={bounty?.amount}
      isSameValue={isSameValue}
      onIssueAmountValueChange={handleIssueAmountOnValueChange}    
      />
  );
}
