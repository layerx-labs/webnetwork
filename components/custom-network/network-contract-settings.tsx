import { useTranslation } from "next-i18next";

import NetworkParameterInput from "components/custom-network/network-parameter-input";

import { SMALL_TOKEN_SYMBOL_LENGTH } from "helpers/constants";
import { formatNumberToCurrency, formatNumberToNScale } from "helpers/formatNumber";
import { NETWORK_LIMITS, NetworkValidator } from "helpers/network";

import { Field } from "interfaces/network";

import { NetworkParameters } from "types/dappkit";

import useMarketplace from "x-hooks/use-marketplace";

export interface NetworkContractSettingsProps {
  parameters: {
    disputableTime: Field<number>,
    percentageNeededForDispute: Field<number>,
    draftTime: Field<number>,
    councilAmount: Field<number>,
    cancelableTime: Field<number>,
    oracleExchangeRate: Field<number>,
    mergeCreatorFeeShare: Field<number>,
    proposerFeeShare: Field<number>,
  },
  onParameterChange: (param: NetworkParameters) => (value: number, validated?: boolean) => void;
}

export default function NetworkContractSettings({
  parameters,
  onParameterChange,
}: NetworkContractSettingsProps) {
  const { t } = useTranslation(["common", "custom-network"]);

  const marketplace = useMarketplace();
  const { data: totalNetworkToken } = marketplace.getTotalNetworkToken();

  const networkTokenSymbol = marketplace?.active?.networkToken?.symbol || t("misc.$token");

  const formatOptions = { maximumFractionDigits: 0 };

  function onChange(param: NetworkParameters) {
    const changeFn = onParameterChange?.(param);
    return (value) => {
      const validated = NetworkValidator(param, value);
      changeFn?.(value, validated);
    }
  }

  const parameterInputs = [
    { 
      label: t("custom-network:dispute-time"), 
      description: t("custom-network:errors.dispute-time", {
        min: NETWORK_LIMITS.disputableTime.min,
        max: formatNumberToCurrency(NETWORK_LIMITS.disputableTime.max, formatOptions)
      }),
      symbol: t("misc.seconds"), 
      value: parameters?.disputableTime?.value,
      error: parameters?.disputableTime?.validated === false,
      decimals: 0,
      onChange: onChange("disputableTime")
    },
    { 
      label: t("custom-network:percentage-for-dispute"), 
      description: t("custom-network:errors.percentage-for-dispute", NETWORK_LIMITS.percentageNeededForDispute),
      symbol: "%", 
      value: parameters?.percentageNeededForDispute?.value,
      error: parameters?.percentageNeededForDispute?.validated === false,
      onChange: onChange("percentageNeededForDispute")
    },
    { 
      label: t("custom-network:redeem-time"), 
      description: t("custom-network:errors.redeem-time", {
        min: NETWORK_LIMITS.draftTime.min,
        max: formatNumberToCurrency(NETWORK_LIMITS.draftTime.max, formatOptions)
      }),
      symbol: t("misc.seconds"), 
      value: parameters?.draftTime?.value,
      error: parameters?.draftTime?.validated === false,
      decimals: 0,
      onChange: onChange("draftTime")
    },
    { 
      label: t("custom-network:council-amount"), 
      description: t("custom-network:errors.council-amount", {
        token: networkTokenSymbol,
        min: formatNumberToCurrency(NETWORK_LIMITS.councilAmount.min, formatOptions),
        max: formatNumberToCurrency(NETWORK_LIMITS.councilAmount.max, formatOptions)
      }),
      symbol: networkTokenSymbol || "Token", 
      value: parameters?.councilAmount?.value,
      error: parameters?.councilAmount?.validated === false,
      onChange: onChange("councilAmount")
    },
    { 
      label: t("custom-network:cancelable-time.label"), 
      description: t("custom-network:cancelable-time.description", {
        min: formatNumberToCurrency(NETWORK_LIMITS.cancelableTime.min, formatOptions)
      }),
      symbol: t("misc.seconds"), 
      value: parameters?.cancelableTime?.value,
      error: parameters?.cancelableTime?.validated === false,
      decimals: 0,
      onChange: onChange("cancelableTime")
    },
    { 
      label: t("custom-network:oracle-exchange-rate.label"), 
      description: t("custom-network:oracle-exchange-rate.description", NETWORK_LIMITS.oracleExchangeRate),
      symbol: "", 
      value: parameters?.oracleExchangeRate?.value,
      error: parameters?.oracleExchangeRate?.validated === false,
      decimals: 0,
      onChange: onChange("oracleExchangeRate"),
      disabled: totalNetworkToken?.gt(0),
      helperText: totalNetworkToken?.gt(0) ? t("custom-network:oracle-exchange-rate.unable-to-change", {
        amount: formatNumberToNScale(totalNetworkToken?.toFixed() || 0),
        symbol:
          networkTokenSymbol?.length > SMALL_TOKEN_SYMBOL_LENGTH
            ? `${networkTokenSymbol.slice(0, SMALL_TOKEN_SYMBOL_LENGTH)}...`
            : networkTokenSymbol,
      }) : ""
    },
    { 
      label: t("custom-network:merger-fee.label"), 
      description: t("custom-network:merger-fee.description", NETWORK_LIMITS.mergeCreatorFeeShare),
      symbol: "%", 
      value: parameters?.mergeCreatorFeeShare?.value,
      error: parameters?.mergeCreatorFeeShare?.validated === false,
      decimals: 4,
      onChange: onChange("mergeCreatorFeeShare")
    },
    { 
      label: t("custom-network:proposer-fee.label"), 
      description: t("custom-network:proposer-fee.description", NETWORK_LIMITS.proposerFeeShare),
      symbol: "%", 
      value: parameters?.proposerFeeShare?.value,
      error: parameters?.proposerFeeShare?.validated === false,
      decimals: 4,
      onChange: onChange("proposerFeeShare")
    }
  ];
  
  return (
    <div className="row mt-2 gy-3">
      {parameterInputs.map((input) => (
        <NetworkParameterInput
          key={input.label}
          data-testid={input.label}
          {...input}
        />
      ))}
    </div>
  );
}
