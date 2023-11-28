import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";

import { IssueBigNumberData } from "interfaces/issue-data";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useAuthentication } from "x-hooks/use-authentication";
import useBepro from "x-hooks/use-bepro";

import BountySettingsView from "./view";

export default function BountySettings({
  isEditIssue,
  currentBounty,
  updateBountyData,
  onEditIssue
}: {
  isEditIssue?: boolean;
  currentBounty: IssueBigNumberData;
  updateBountyData: (updatePrData?: boolean) => void;
  onEditIssue: () => void;
}) {
  const { t } = useTranslation(["common", "bounty"]);

  const [isCancelable, setIsCancelable] = useState(false);

  const { addError } = useToastStore();
  const { service: daoService } = useDaoStore();
  const { currentUser } = useUserStore();
  const { updateWalletBalance } = useAuthentication();
  const { handleReedemIssue, handleHardCancelBounty, getCancelableTime } = useBepro();

  const isGovernor = currentUser?.isGovernor;
  const objViewProps = {
    onEditIssue,
    isWalletConnected: !!currentUser?.walletAddress,
    isBountyInDraft: !!currentBounty?.isDraft,
    isBountyOwner:
      !!currentUser?.walletAddress &&
      currentBounty?.user?.address &&
      currentBounty?.user?.address ===
        currentUser?.walletAddress,

    isFundingRequest: !!currentBounty?.isFundingRequest,
    isBountyFunded: currentBounty?.fundedAmount?.isEqualTo(currentBounty?.fundingAmount),
    isBountyOpen:
      currentBounty?.isClosed === false &&
      currentBounty?.isCanceled === false,
  };

  async function handleHardCancel() {
    handleHardCancelBounty(currentBounty.contractId, currentBounty.id)
      .then(() => {
        updateWalletBalance();
        updateBountyData();
      })
      .catch(error => {
        addError(t("actions.failed"), t("bounty:errors.failed-to-cancel"));
        console.debug("Failed to cancel bounty", error);
      });
  }

  async function handleRedeem() {
    if (!currentBounty) return;
    
    const isFundingRequest = currentBounty.fundingAmount.gt(0);

    handleReedemIssue(currentBounty.contractId, currentBounty.id, isFundingRequest)
      .then(() => {
        updateWalletBalance(true);
        updateBountyData();
      })
      .catch(error => {
        addError(t("actions.failed"), t("bounty:errors.failed-to-cancel"));
        console.debug("Failed to cancel bounty", error);
      });
  }

  function checkRender() {
    const { isBountyOwner, isBountyInDraft } = objViewProps

    const isOwner = (isGovernor && isBountyOwner) ? true : isBountyOwner
    const isHardCancel = (isCancelable && isGovernor)
    const isOwnerCancel = (isBountyInDraft && isOwner)

    return (isOwnerCancel || isHardCancel)
  }

  useEffect(() => {
    if (daoService && currentBounty)
      (async () => {
        const cancelableTime = await getCancelableTime();
        const canceable =
          +new Date() >=
          +new Date(+currentBounty.createdAt + cancelableTime);
        setIsCancelable(canceable);
      })();
  }, [daoService, currentBounty]);

  if (!checkRender())
    return <></>;

  return (
    <BountySettingsView
      isCancelable={isCancelable}
      isGovernor={isGovernor}
      handleHardCancel={handleHardCancel}
      handleRedeem={handleRedeem}
      isEditIssue={isEditIssue}
      {...objViewProps}
    />
  );
}
