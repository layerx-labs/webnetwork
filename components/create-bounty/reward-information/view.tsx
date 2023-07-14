
import { FormCheck } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import CreateBountyRewardInfo from "../create-bounty-reward-info";
import CreateBountyTokenAmount from "../create-bounty-token-amount";
import { RewardInformationViewProps } from "./reward-information";

export default function RewardInformationView({
  transactionalToken,
  rewardToken,
  isFundingType,
  currentUserWallet,
  rewardChecked,
  defaultValue,
  bountyDecimals,
  rewardDecimals,
  issueAmount,
  rewardAmount,
  bountyTokens,
  rewardTokens,
  rewardBalance,
  bountyBalance,
  updateRewardToken,
  updateTransactionalToken,
  addToken,
  handleRewardChecked,
  updateIssueAmount,
  updateRewardAmount,
  updateIsFundingType,
}: RewardInformationViewProps) {
  const { t } = useTranslation(["common", "bounty"]);

  function renderBountyToken(type: "bounty" | "reward") {
    const fieldParams = {
      bounty: {
        token: transactionalToken,
        setToken: updateTransactionalToken,
        default: transactionalToken,
        decimals: bountyDecimals,
        amount: issueAmount,
        setAmount: updateIssueAmount,
        tokens: bountyTokens,
        balance: bountyBalance,
        isFunding: isFundingType,
        label: t("bounty:fields.select-token.bounty", {
          set: t("bounty:fields.set"),
        }),
      },
      reward: {
        token: rewardToken,
        setToken: updateRewardToken,
        default: rewardToken,
        decimals: rewardDecimals,
        amount: rewardAmount,
        setAmount: updateRewardAmount,
        tokens: rewardTokens,
        balance: rewardBalance,
        isFunding: isFundingType,
        label: t("bounty:fields.select-token.reward", {
          set: t("bounty:fields.set"),
        }),
      },
    };

    return (
      <>
        <CreateBountyTokenAmount
          currentToken={fieldParams[type].token}
          setCurrentToken={fieldParams[type].setToken}
          customTokens={fieldParams[type].tokens}
          userAddress={currentUserWallet}
          defaultToken={fieldParams[type].default}
          canAddCustomToken={false}
          addToken={addToken}
          decimals={fieldParams[type].decimals}
          issueAmount={fieldParams[type].amount}
          setIssueAmount={fieldParams[type].setAmount}
          tokenBalance={fieldParams[type].balance}
          isFunders={type === "reward" ? false : true}
          needValueValidation={!isFundingType || type === "reward"}
          isFunding={isFundingType}
          labelSelect={fieldParams[type].label}
        />
      </>
    );
  }

  return (
    <CreateBountyRewardInfo
      isFunding={isFundingType}
      updateIsFunding={(e: boolean) => {
        if (e === true) updateIssueAmount(defaultValue);
        else {
          updateIssueAmount(defaultValue);
          updateRewardAmount(defaultValue);
        }

        updateIsFundingType(e);
      }}
    >
      {isFundingType ? (
        <>
          {renderBountyToken("bounty")}
          <div className="col-md-12 my-4">
            <FormCheck
              className="form-control-md pb-0"
              type="checkbox"
              label={t("bounty:reward-funders")}
              onChange={handleRewardChecked}
              checked={rewardChecked}
            />
            <p className="ms-4 text-gray">
              {t("bounty:reward-funders-description")}
            </p>
          </div>
        </>
      ) : (
        renderBountyToken("bounty")
      )}
      {rewardChecked && isFundingType && renderBountyToken("reward")}
    </CreateBountyRewardInfo>
  );
}
