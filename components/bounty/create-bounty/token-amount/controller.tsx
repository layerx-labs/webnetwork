import {useEffect, useState} from "react";
import {NumberFormatValues} from "react-number-format";

import BigNumber from "bignumber.js";
import {useDebouncedCallback} from "use-debounce";

import calculateDistributedAmounts, {calculateTotalAmountFromGivenReward} from "helpers/calculateDistributedAmounts";

import {Network} from "interfaces/network";
import {DistributionsProps} from "interfaces/proposal";
import {Token} from "interfaces/token";

import {useUserStore} from "x-hooks/stores/user/user.store";

import CreateBountyTokenAmountView from "./view";

const ZeroNumberFormatValues = {
  value: "",
  formattedValue: "",
  floatValue: 0,
};

interface CreateBountyTokenAmountProps {
  currentToken: Token;
  updateCurrentToken: (v: Token) => void;
  addToken: (v: Token) => Promise<void>;
  canAddCustomToken: boolean;
  defaultToken: Token;
  userAddress: string;
  customTokens: Token[];
  labelSelect?: string;
  tokenBalance: BigNumber;
  issueAmount: NumberFormatValues;
  updateIssueAmount: (v: NumberFormatValues) => void;
  isFunders: boolean;
  decimals: number;
  isFunding: boolean;
  needValueValidation: boolean;
  previewAmount: NumberFormatValues;
  distributions: DistributionsProps;
  currentNetwork: Network;
  setPreviewAmount: (v: NumberFormatValues) => void;
  setDistributions: (v: DistributionsProps) => void;
  sethasAmountError: (v: boolean) =>void;
}

export default function CreateBountyTokenAmount({
  currentNetwork,
  currentToken,
  updateCurrentToken,
  addToken,
  canAddCustomToken,
  defaultToken = null,
  userAddress,
  customTokens,
  labelSelect,
  tokenBalance,
  issueAmount,
  updateIssueAmount,
  isFunders = false,
  needValueValidation,
  decimals = 18,
  isFunding = false,
  previewAmount,
  distributions,
  setPreviewAmount,
  setDistributions,
  sethasAmountError,
}: CreateBountyTokenAmountProps) {
  const [show, setShow] = useState<boolean>(false);
  const [inputError, setInputError] = useState("");

  const { currentUser } = useUserStore();

  const debouncedDistributionsUpdater =
    useDebouncedCallback((value, type) =>
      handleDistributions(value, type), 500);

  const amountIsGtBalance = (v: string | number, balance: BigNumber) => BigNumber(v).gt(balance)


  function calculateRewardAmountGivenTotalAmount(value: number) {
    const { chain, mergeCreatorFeeShare, proposerFeeShare } = currentNetwork;

    const _value = BigNumber(value);

    const treasuryAmount = _value.times(chain.closeFeePercentage/100);
    const mergerFee = _value.minus(treasuryAmount).times(+mergeCreatorFeeShare/100);
    const proposerFee = _value.minus(treasuryAmount).minus(mergerFee).times(+proposerFeeShare/100);

    return _value.minus(treasuryAmount).minus(mergerFee).minus(proposerFee).toFixed();
  }

  function _calculateTotalAmountFromGivenReward(reward: number) {
    const { chain, mergeCreatorFeeShare, proposerFeeShare } = currentNetwork;

    return calculateTotalAmountFromGivenReward( reward, 
                                                +chain.closeFeePercentage/100,
                                                +mergeCreatorFeeShare/100,
                                                +proposerFeeShare/100)
  }

  const handleNumberFormat = (v: BigNumber) => ({
    value: v.decimalPlaces(5, 0).toFixed(),
    floatValue: v.toNumber(),
    formattedValue: v.decimalPlaces(Math.min(10, decimals), 0).toFixed()
  });

  function resetDistributions() {
    const { mergeCreatorFeeShare, proposerFeeShare, chain } = currentNetwork;

    setDistributions({
      treasuryAmount: {
        value: '0',
        percentage: chain.closeFeePercentage.toFixed(),
      },
      mergerAmount: {
        value: '0',
        percentage: mergeCreatorFeeShare.toString(),
      },
      proposerAmount: {
        value: '0',
        percentage: proposerFeeShare.toString(),
      },
      proposals: [],
      totalServiceFees: BigNumber(0)
    });
  }

  function handleDistributions(value, type) {
    if (!currentNetwork || !isFunders) return;

    const { mergeCreatorFeeShare, proposerFeeShare, chain } = currentNetwork;

    if (!value || !(+value)) {
      resetDistributions();
      updateIssueAmount(ZeroNumberFormatValues);
      setPreviewAmount(ZeroNumberFormatValues);
      return;
    }

    const amountOfType =
      BigNumber(type === "reward"
        ? _calculateTotalAmountFromGivenReward(value)
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

    const { mergerAmount, proposerAmount, treasuryAmount } = initialDistributions;

    const mergerAmountValue = new BigNumber(mergerAmount.value);
    const proposerAmountValue = new BigNumber(proposerAmount.value);
    const treasuryAmountValue = new BigNumber(treasuryAmount.value);

    const totalServiceFees = mergerAmountValue.plus(proposerAmountValue).plus(treasuryAmountValue) || BigNumber(0)

    const _distributions = { totalServiceFees, ...initialDistributions}

    if(type === 'reward'){
      const total = BigNumber(_calculateTotalAmountFromGivenReward(value));
      updateIssueAmount(handleNumberFormat(total))
      if (amountIsGtBalance(total.toNumber(), tokenBalance) && !isFunding) {
        setInputError("bounty:errors.exceeds-allowance");
        sethasAmountError(true);
      }
    }

    if(type === 'total'){
      const rewardValue = BigNumber(calculateRewardAmountGivenTotalAmount(value));
      setPreviewAmount(handleNumberFormat(rewardValue));

      if (rewardValue.isLessThan(BigNumber(currentToken?.minimum))) {
        setInputError("bounty:errors.exceeds-minimum-amount");
        sethasAmountError(true);
      }
    }

    setDistributions(_distributions);
  }

  function handleIssueAmountOnValueChange(values: NumberFormatValues, type: 'reward' | 'total') {
    const setType = type === 'reward' ? setPreviewAmount : updateIssueAmount;
    const setOtherType = type === 'reward' ? updateIssueAmount : setPreviewAmount;

    if(needValueValidation && amountIsGtBalance(values.floatValue, tokenBalance)){
      setInputError("bounty:errors.exceeds-balance");
      setType(values);
      setOtherType(ZeroNumberFormatValues);
      sethasAmountError(true);
      resetDistributions();
    }else if (
      needValueValidation &&
      +values.floatValue > +currentToken?.currentValue
    ) {
      setType(ZeroNumberFormatValues);
      setOtherType(ZeroNumberFormatValues);
      resetDistributions();
      setInputError("bounty:errors.exceeds-allowance");
      sethasAmountError(true);
    } else if (values.floatValue < 0) {
      setType(ZeroNumberFormatValues);
      setOtherType(ZeroNumberFormatValues);
    } else if (
      values.floatValue !== 0 &&
      BigNumber(values.floatValue).isLessThan(BigNumber(currentToken?.minimum))
    ) {
      setType(values); 
      setOtherType(ZeroNumberFormatValues);
      resetDistributions();
      setInputError("bounty:errors.exceeds-minimum-amount");
      sethasAmountError(true);
    } else {
      if (inputError) {
        setInputError("");
        sethasAmountError(false);
      }
      debouncedDistributionsUpdater(values.value, type);
      setType(handleNumberFormat(BigNumber(values.value)));
    }
  }

  function handleUpdateToken() {
    if (issueAmount?.floatValue === 0 || previewAmount?.floatValue === 0) return;

    if (
      BigNumber(issueAmount?.floatValue).isLessThan(BigNumber(currentToken?.minimum)) ||
      BigNumber(previewAmount?.floatValue).isLessThan(BigNumber(currentToken?.minimum))
    ) {
      setInputError("bounty:errors.exceeds-minimum-amount");
      sethasAmountError(true);
    } else {
      setInputError("");
      sethasAmountError(false);
    }
  }

  useEffect(handleUpdateToken, [currentToken?.minimum]);

  return (
    <CreateBountyTokenAmountView
      currentToken={currentToken}
      updateCurrentToken={updateCurrentToken}
      addToken={addToken}
      onIssueAmountValueChange={handleIssueAmountOnValueChange}
      canAddCustomToken={canAddCustomToken}
      defaultToken={defaultToken}
      userAddress={userAddress}
      customTokens={customTokens}
      labelSelect={labelSelect}
      tokenBalance={tokenBalance}
      issueAmount={issueAmount}
      rewardAmount={previewAmount}
      isFunders={isFunders}
      decimals={decimals}
      isFunding={isFunding}
      inputError={inputError}
      showFeesModal={show}
      updateShowFeesModal={setShow}
      distributions={distributions}
    />
  );
}
