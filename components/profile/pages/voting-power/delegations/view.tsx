import BigNumber from "bignumber.js";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

import InfoTooltip from "components/info-tooltip";
import DelegationItem from "components/profile/pages/voting-power/delegation-item/controller";
import { FlexRow } from "components/profile/wallet-balance";

import { formatStringToCurrency } from "helpers/formatNumber";

import { Delegation } from "interfaces/curators";
import { DelegationExtended } from "interfaces/oracles-state";

import TokenSymbolView from "../../../../common/token-symbol/view";

interface Info {
    title: string;
    description: string;
    total: string | undefined;
    delegations: JoinedDelegation[] | (number | BigNumber)[];
}

interface DelegationsViewProps {
  type: "toMe" | "toOthers";
  variant: "network" | "multi-network";
  tokenColor: string;
  renderInfo: {
    toMe: Info;
    toOthers: Info;
  }
  votesSymbol: string;
  getTextColorProps: () => { className: string } | { style: { color: string } };
  networkTokenName: string;
}

type JoinedDelegation = Delegation | DelegationExtended;

export default function DelegationsView({
  type = "toMe",
  variant = "network",
  tokenColor,
  renderInfo,
  votesSymbol,
  getTextColorProps,
  networkTokenName,
}: DelegationsViewProps) {
  const { t } = useTranslation(["common", "profile", "my-oracles"]);

  return (
    <div className="mb-3">
      <FlexRow className="mb-3 justify-content-between align-items-center">
        <span className="h4 family-Regular text-white font-weight-500">
          {renderInfo[type].title}
        </span>

        <FlexRow
          className={clsx([
            "d-flex justify-content-center align-items-center gap-2 caption-large",
            "text-white bg-gray-900 py-2 px-3 border-radius-4 border border-gray-800 font-weight-medium",
          ])}
        >
          <span>{formatStringToCurrency(renderInfo[type].total)}</span>

          <TokenSymbolView name={votesSymbol} {...getTextColorProps()} />

          <InfoTooltip
            description={renderInfo[type].description}
            secondaryIcon
          />
        </FlexRow>
      </FlexRow>

      <div className="row">
        <div className="col">
          {type === "toOthers" &&
            !renderInfo[type].delegations?.length &&
            t("my-oracles:errors.no-delegates")}

          {(type === "toMe" || !!renderInfo[type].delegations?.length) &&
            renderInfo[type].delegations.map((delegation) => (
              <DelegationItem
                key={`delegation-${delegation.id}-${delegation.to}`}
                type={type}
                delegation={
                  type === "toMe" ? { amount: delegation } : delegation
                }
                tokenName={networkTokenName}
                variant={variant}
                tokenColor={tokenColor}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
