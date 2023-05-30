import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import { useAppState } from "contexts/app-state";

import { getIssueState } from "helpers/handleTypeIssue";

import { fundingBenefactor } from "interfaces/issue-data";

import FundingSectionView from "./view";

export default function FundingSectionController() {
  const { t } = useTranslation(["common", "funding"]);

  const [walletFunds, setWalletFunds] = useState<fundingBenefactor[]>();

  const { state } = useAppState();

  const isConnected = !!state.currentUser?.walletAddress;
  const hasReward = state.currentBounty?.data?.hasReward;
  const isBountyClosed = !!state.currentBounty?.data?.isClosed;
  const isBountyFunded = !!state.currentBounty?.data?.isFunded;
  const isBountyInDraft = !!state.currentBounty?.data?.isDraft;
  const transactionalSymbol =
    state.currentBounty?.data?.transactionalToken?.symbol;
  const rewardTokenSymbol = state.currentBounty?.data?.rewardToken?.symbol;

  const fundsGiven =
    walletFunds?.reduce((acc, fund) => fund.amount.plus(acc), BigNumber(0)) ||
    BigNumber(0);

  const futureRewards = fundsGiven
    .multipliedBy(state.currentBounty?.data?.rewardAmount)
    .dividedBy(state.currentBounty?.data?.fundingAmount)
    .toFixed();

  const collapseAction = isBountyClosed
    ? t("funding:rewards")
    : t("funding:actions.manage-funding");

  const isCanceled =
    getIssueState({
      state: state.currentBounty?.data?.state,
      amount: state.currentBounty?.data?.amount,
      fundingAmount: state.currentBounty?.data?.fundingAmount,
    }) === "canceled";

  useEffect(() => {
    if (!state.currentUser?.walletAddress || !state.currentBounty?.data) return;

    const funds = 
      state.currentBounty?.data?.benefactors.filter((fund) => fund.address === state.currentUser.walletAddress);

    setWalletFunds(funds);
  }, [state.currentUser, state.currentBounty?.data, state.currentBounty?.data]);

  if (isBountyFunded && !walletFunds?.length) return <></>;

  return (
    <FundingSectionView
      walletFunds={walletFunds}
      isBountyFunded={isBountyFunded}
      isConnected={isConnected}
      isCanceled={isCanceled}
      transactionalSymbol={transactionalSymbol}
      bounty={state.currentBounty?.data}
      hasReward={hasReward}
      fundsGiven={fundsGiven}
      futureRewards={futureRewards}
      collapseAction={collapseAction}
      isBountyClosed={isBountyClosed}
      isBountyInDraft={isBountyInDraft}
      rewardTokenSymbol={rewardTokenSymbol}
    />
  );
}
