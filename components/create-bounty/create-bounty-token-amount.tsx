import { useEffect, useState } from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";

import ResponsiveWrapper from "components/responsive-wrapper";

import InputNumber from "../input-number";
import TokensDropdown from "../tokens-dropdown";
import RewardInformationBalanceView from "./reward-information/balance/view";

export default function CreateBountyTokenAmount({
  currentToken,
  setCurrentToken,
  addToken,
  canAddCustomToken,
  defaultToken = null,
  userAddress,
  customTokens,
  labelSelect,
  tokenBalance,
  issueAmount,
  setIssueAmount,
  isFunders = false,
  needValueValidation,
  decimals = 18,
  isFunding = false,
}) {
  const { t } = useTranslation("bounty");
  const { publicRuntimeConfig } = getConfig();
  const [inputError, setInputError] = useState("");

  function handleIssueAmountOnValueChange(values: NumberFormatValues) {
    if (
      needValueValidation &&
      +values.floatValue > +currentToken?.currentValue
    ) {
      setIssueAmount({ formattedValue: "" });
      setInputError(t("bounty:errors.exceeds-allowance"));
    } else if (values.floatValue < 0) {
      setIssueAmount({ formattedValue: "" });
    } else if (
      values.floatValue !== 0 &&
      BigNumber(values.floatValue).isLessThan(BigNumber(currentToken?.minimum))
    ) {
      setIssueAmount(values);
      setInputError(t("bounty:errors.exceeds-minimum-amount", {
          amount: currentToken?.minimum,
      }));
    } else {
      setIssueAmount(values);
      if (inputError) setInputError("");
    }
  }

  function handleIssueAmountBlurChange() {
    if (needValueValidation && tokenBalance?.lt(issueAmount.floatValue)) {
      setIssueAmount({ formattedValue: tokenBalance.toFixed() });
    }
  }

  function selectTokens() {
    return (
      <TokensDropdown
        token={currentToken}
        label={labelSelect}
        tokens={customTokens}
        userAddress={userAddress}
        canAddToken={canAddCustomToken}
        addToken={addToken}
        setToken={setCurrentToken}
        disabled={false}
        defaultToken={defaultToken}
        showCurrencyValue={false}
        needsBalance={isFunding}
        noLabel
      />
    );
  }

  function inputNumber() {
    return (
      <InputNumber
        symbol={currentToken?.symbol}
        classSymbol=""
        thousandSeparator
        fullWidth={!publicRuntimeConfig?.enableCoinGecko}
        max={tokenBalance.toFixed()}
        value={issueAmount.value}
        placeholder="0"
        allowNegative={false}
        decimalScale={decimals}
        onValueChange={handleIssueAmountOnValueChange}
        onBlur={handleIssueAmountBlurChange}
        error={!!inputError}
        helperText={
          <>{inputError && <p className="p-small my-2">{inputError}</p>}</>
        }
      />
    );
  }

  function RenderBalance() {
    if (isFunding && isFunders) return null;
    return (
      <RewardInformationBalanceView
        amount={tokenBalance.toFixed()}
        symbol={currentToken?.symbol}
      />
    );
  }

  function RenderItemRow({
    children,
    label = "",
    description = "",
    borderBottom = true,
  }) {
    return (
      <div
        className={`mt-4 pb-4 ${
          borderBottom ? "border-bottom border-gray-700" : ""
        }`}
      >
        <label className="text-white">{label}</label>
        <div className="row justify-content-between">
          <div className="col-md-6 col-12 text-gray mt-1">{description}</div>
          <div className="col-md-4 col-12 mt-1">{children}</div>
        </div>
      </div>
    );
  }

  function renderPrimaryToken() {
    return (
      <div>
        <div className="row d-flex flex-wrap justify-content-between">
          <div className="col col-md-5 mb-0 pb-0">
            {selectTokens()}
            <ResponsiveWrapper className="mt-1" xs={true} md={false}>
              <RenderBalance />
            </ResponsiveWrapper>
          </div>

          <ResponsiveWrapper
            className="d-flex justify-content-end mt-3"
            xs={false}
            md={true}
          >
            <RenderBalance />
          </ResponsiveWrapper>
        </div>

        <RenderItemRow
          label={isFunding ? t("bounty:fields.select-token.reward") : t("bounty:fields.select-token.bounty")}
          description="Est quis sit irure exercitation id consequat cupidatat elit nulla velit amet ex."
        >
          {inputNumber()}
        </RenderItemRow>
        <RenderItemRow
          label="Service fees"
          description="Est quis sit irure exercitation id consequat cupidatat elit nulla velit amet ex."
        >
          <InputNumber
            symbol={currentToken?.symbol}
            classSymbol=""
            thousandSeparator
            value={"10000"}
            disabled
          />
        </RenderItemRow>
        <RenderItemRow
          label="Total amount"
          description="Est quis sit irure exercitation id consequat cupidatat elit nulla velit amet ex."
          borderBottom={isFunding ? true : false}
        >
          {inputNumber()}
        </RenderItemRow>
      </div>
    );
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

  useEffect(handleUpdateToken, [currentToken?.minimum]);

  return (
    <div className="mt-4">
      <label className="mb-1 text-gray">
        {isFunding
          ? isFunders
            ? t("fields.select-token.label")
            : t("fields.select-token.reward")
          : t("fields.select-token.label")}
      </label>
      {isFunding ? (
        isFunders ? (
          renderPrimaryToken()
        ) : (
          <div className="row d-flex flex-wrap justify-content-between">
            <div className="col col-md-5 mb-0 pb-0">
              {selectTokens()}
              <ResponsiveWrapper className="mt-1 mb-4" xs={true} md={false}>
                <RenderBalance />
              </ResponsiveWrapper>
            </div>
            <div className="col-md-4 col-12">{inputNumber()}</div>
          </div>
        )
      ) : (
        renderPrimaryToken()
      )}
    </div>
  );
}
