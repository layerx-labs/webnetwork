import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import InputNumber from "components/input-number";

import { DistributionsProps } from "interfaces/proposal";
import { Token } from "interfaces/token";

import RenderItemRow from "../create-bounty/token-amount/item-row/view";


interface AmountTokenInformationProps {
  isFunding: boolean;
  currentToken: Token;
  rewardAmount: NumberFormatValues;
  issueAmount: NumberFormatValues;
  tokenBalance: BigNumber;
  decimals: number;
  inputError: string;
  distributions: DistributionsProps;
  onIssueAmountValueChange: (
    values: NumberFormatValues,
    type: "reward" | "total"
  ) => void;
  updateShowFeesModal?: () => void;
  classNameInputs?: string;
}

export default function AmountTokenInformation({
  isFunding,
  currentToken,
  rewardAmount,
  issueAmount,
  tokenBalance,
  decimals,
  distributions,
  inputError,
  classNameInputs,
  onIssueAmountValueChange,
  updateShowFeesModal,

}: AmountTokenInformationProps) {
  const { t } = useTranslation(["bounty"]);

  const { errorTranslation, isMinimumError } = {
    "bounty:errors.exceeds-minimum-amount": {
      errorTranslation: t(inputError, { amount: currentToken?.minimum }),
      isMinimumError: true,
    },
  }[inputError] || {
    errorTranslation: t(inputError),
    isMinimumError: false,
  };

  return (
    <>
      <RenderItemRow
        label={
          isFunding
            ? t("bounty:fields.select-token.reward")
            : t("bounty:fields.select-token.bounty")
        }
        description={
          isFunding
            ? t("bounty:set-funded-reward-description")
            : t("bounty:set-reward-description")
        }
        tooltip={t("approximated-values-warning")}
        classNameChildren={classNameInputs}
      >
        <InputNumber
          symbol={currentToken?.symbol}
          data-testid={isFunding ? 'funded-reward-input' : 'reward-input'}
          classSymbol=""
          thousandSeparator
          value={rewardAmount?.value}
          placeholder="0"
          max={tokenBalance?.toFixed()}
          allowNegative={false}
          decimalScale={decimals}
          onValueChange={
            (e, sourceInfo) => {
              if (e.value !== rewardAmount.value && sourceInfo?.source === "event")
                onIssueAmountValueChange(e, "reward");
            }
          }
          error={!!errorTranslation && isMinimumError}
          helperText={
            <>{(!!errorTranslation && isMinimumError) && <p className="p-small">{errorTranslation}</p>}</>
          }
        />
      </RenderItemRow>
      <RenderItemRow
        label={t("bounty:service-fee.title")}
        description={t("bounty:service-fee.support-message")}
        handleLink={updateShowFeesModal}
        classNameChildren={classNameInputs}
      >
        <InputNumber
          data-testid="service-fee-input"
          symbol={currentToken?.symbol}
          classSymbol=""
          thousandSeparator
          value={distributions?.totalServiceFees?.decimalPlaces(5)?.toFixed() || ""}
          disabled
        />
      </RenderItemRow>
      <RenderItemRow
        label={t("bounty:total-amount.title")}
        description={t("bounty:total-amount.description")}
        borderBottom={isFunding ? true : false}
        classNameChildren={classNameInputs}
      >
        <InputNumber
          data-testid="total-amount-input"
          symbol={currentToken?.symbol}
          classSymbol=""
          thousandSeparator
          value={issueAmount?.value}
          placeholder="0"
          allowNegative={false}
          max={tokenBalance?.toFixed()}
          decimalScale={decimals}
          onValueChange={
            (e, sourceInfo) => {
              if (e.value !== rewardAmount.value && sourceInfo?.source === "event")
                onIssueAmountValueChange(e, "total");
            }
          }
          error={!!errorTranslation && !isMinimumError}
          helperText={
            <>{(!!errorTranslation && !isMinimumError) && <p className="p-small">{errorTranslation}</p>}</>
          }
        />
      </RenderItemRow>
    </>
  );
}
