import RewardInformationSectionView from "components/bounty/create-bounty/sections/reward-information/view";

import { RewardInformationSectionProps } from "types/components";

import { useUserStore } from "x-hooks/stores/user/user.store";

const ZeroNumberFormatValues = {
  value: "",
  formattedValue: "",
  floatValue: 0,
};

export default function RewardInformationSection({
  currentNetwork,
  transactionalToken,
  rewardToken,
  isFundingType,
  rewardChecked,
  bountyDecimals,
  rewardDecimals,
  issueAmount,
  rewardAmount,
  bountyTokens,
  rewardTokens,
  rewardBalance,
  bountyBalance,
  previewAmount,
  distributions,
  updateRewardToken,
  updateTransactionalToken,
  addToken,
  handleRewardChecked,
  updateIssueAmount,
  updateRewardAmount,
  updateIsFundingType,
  setPreviewAmount,
  setDistributions,
  sethasAmountError,
}: RewardInformationSectionProps) {
  const { currentUser } = useUserStore();

  function handleIsFunding(e: boolean) {
    if (e === true) updateIssueAmount(ZeroNumberFormatValues);
    else {
      updateIssueAmount(ZeroNumberFormatValues);
      updateRewardAmount(ZeroNumberFormatValues);
    }

    updateIsFundingType(e);
  }

  return (
    <RewardInformationSectionView
      currentNetwork={currentNetwork}
      isFundingType={isFundingType}
      defaultValue={ZeroNumberFormatValues}
      currentUserWallet={currentUser?.walletAddress}
      rewardChecked={rewardChecked}
      transactionalToken={transactionalToken}
      rewardToken={rewardToken}
      bountyDecimals={bountyDecimals}
      rewardDecimals={rewardDecimals}
      issueAmount={issueAmount}
      rewardAmount={rewardAmount}
      bountyTokens={bountyTokens}
      rewardTokens={rewardTokens}
      rewardBalance={rewardBalance}
      bountyBalance={bountyBalance}
      previewAmount={previewAmount}
      distributions={distributions}
      updateRewardToken={updateRewardToken}
      updateTransactionalToken={updateTransactionalToken}
      addToken={addToken}
      handleRewardChecked={handleRewardChecked}
      updateIssueAmount={updateIssueAmount}
      updateRewardAmount={updateRewardAmount}
      updateIsFunding={handleIsFunding}
      setPreviewAmount={setPreviewAmount}
      setDistributions={setDistributions}
      sethasAmountError={sethasAmountError}
    />
  );
}
