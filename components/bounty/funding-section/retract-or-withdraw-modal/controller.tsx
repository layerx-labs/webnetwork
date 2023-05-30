import { useState } from "react";

import { useTranslation } from "next-i18next";

import { useAppState } from "contexts/app-state";
import { toastError, toastSuccess } from "contexts/reducers/change-toaster";

import { NetworkEvents, StandAloneEvents } from "interfaces/enums/events";
import { fundingBenefactor } from "interfaces/issue-data";

import useApi from "x-hooks/use-api";
import useBepro from "x-hooks/use-bepro";
import { useBounty } from "x-hooks/use-bounty";

import RetractOrWithdrawModalView from "./view";

interface RetractOrWithdrawModalControllerProps {
  show?: boolean;
  onCloseClick: () => void;
  funding: fundingBenefactor;
}

export default function RetractOrWithdrawModalController({
  show = false,
  onCloseClick,
  funding,
}: RetractOrWithdrawModalControllerProps) {
  const { t } = useTranslation(["common", "funding", "bounty"]);

  const [isExecuting, setIsExecuting] = useState(false);

  const { processEvent } = useApi();
  const { getDatabaseBounty } = useBounty();
  const { handleRetractFundBounty, handleWithdrawFundRewardBounty } =
    useBepro();

  const { dispatch, state } = useAppState();

  const isBountyClosed = !!state.currentBounty?.data?.isClosed;
  const tokenSymbol = state.currentBounty?.data?.transactionalToken?.symbol;
  const rewardTokenSymbol = state.currentBounty?.data?.rewardToken?.symbol;
  const retractOrWithdrawAmount = isBountyClosed
    ? funding?.amount
        ?.dividedBy(state.currentBounty?.data?.fundingAmount)
        .multipliedBy(state.currentBounty?.data?.rewardAmount)
        ?.toFixed()
    : funding?.amount?.toFixed();

  function handleRetractOrWithdraw() {
    if (!state.currentBounty?.data || !funding) return;

    setIsExecuting(true);
    if (isBountyClosed) {
      handleWithdrawFundRewardBounty(state.currentBounty?.data?.contractId,
                                     funding.contractId,
                                     retractOrWithdrawAmount,
                                     rewardTokenSymbol)
        .then(() => {
          return processEvent(StandAloneEvents.BountyWithdrawReward,
                              undefined,
                              {
              issueId: state.currentBounty?.data?.issueId,
                              });
        })
        .then(() => {
          getDatabaseBounty(true);
          onCloseClick();
          dispatch(toastSuccess(t("funding:modals.reward.withdraw-x-symbol", {
                amount: retractOrWithdrawAmount,
                symbol: rewardTokenSymbol,
          }),
                                t("funding:modals.reward.withdraw-successfully")));
        })
        .catch((error) => {
          console.debug("Failed to withdraw funds reward", error);
          dispatch(toastError(t("funding:try-again"),
                              t("funding:modals.reward.failed-to-withdraw")));
        })
        .finally(() => setIsExecuting(false));
    } else {
      handleRetractFundBounty(state.currentBounty?.data?.contractId,
                              funding.contractId)
        .then((txInfo) => {
          const { blockNumber: fromBlock } = txInfo as { blockNumber: number };

          getDatabaseBounty(true);

          return processEvent(NetworkEvents.BountyFunded, undefined, {
            fromBlock,
          });
        })
        .then(async () => {
          onCloseClick();
          await getDatabaseBounty(true);

          dispatch(toastSuccess(t("funding:modals.retract.retract-x-symbol", {
                amount: retractOrWithdrawAmount,
                symbol: tokenSymbol,
          }),
                                t("funding:modals.retract.retract-successfully")));
        })
        .catch((error) => {
          console.debug("Failed to retract funds", error);
          dispatch(toastError(t("funding:try-again"),
                              t("funding:modals.retract.failed-to-retract")));
        })
        .finally(() => setIsExecuting(false));
    }
  }

  return (
    <RetractOrWithdrawModalView
      show={show}
      onCloseClick={onCloseClick}
      isExecuting={isExecuting}
      isBountyClosed={isBountyClosed}
      retractOrWithdrawAmount={retractOrWithdrawAmount}
      rewardTokenSymbol={rewardTokenSymbol}
      tokenSymbol={tokenSymbol}
      handleRetractOrWithdraw={handleRetractOrWithdraw}
      contractId={state.currentBounty?.data?.contractId}
    />
  );
}
