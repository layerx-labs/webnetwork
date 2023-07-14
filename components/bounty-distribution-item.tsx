import BigNumber from "bignumber.js";

import ArrowRight from "assets/icons/arrow-right";

import Avatar from "components/avatar";
import TokenSymbolView from "components/common/token-symbol/view";
import InfoTooltip from "components/info-tooltip";

import { formatNumberToNScale } from "helpers/formatNumber";

import { BountyDistribution } from "interfaces/bounty-distribution";

export default function BountyDistributionItem({
  percentage = "0",
  name,
  symbols,
  amounts,
  description,
  githubLogin,
  className,
}: BountyDistribution) {
  function verifyAmount(): boolean {
    return amounts.length > 1 && BigNumber(amounts[1]).gt(0);
  }

  return (
    <li
      className={`d-flex align-items-center bg-gray-850 px-3 py-2 text-truncate ${className}`}
      key={name}
    >
      <div className="d-flex flex-grow-1 flex-column">
        <div className="text-gray label-m d-flex align-items-center gap-2 mb-1">
          {githubLogin ? <Avatar key={githubLogin}  size="xsm"  userLogin={githubLogin} tooltip /> : null}
          <label className="text-truncate text-uppercase">
            {name}
          </label>
          {description && (
            <InfoTooltip description={description} secondaryIcon={true} />
          )}

        </div>
        {verifyAmount() && (
          <span className="caption-small text-light-gray">{name}</span>
        )}
      </div>
      
      <div className={"d-flex flex-column text-truncate"}>
        <div className="d-flex align-items-center gap-2 justify-content-end">
          <span className="ms-1 text-gray label-m ">
            {percentage}%
          </span>
          
          <ArrowRight color="text-gray" width={14}/>

          <span className="caption-medium text-white text-truncate">
            {formatNumberToNScale(amounts[0])}{" "}

            <TokenSymbolView name={symbols[0]} className="ps-1 pt-1 caption-small text-uppercase text-primary"/>
          </span>
          
        </div>

        {verifyAmount() && (
          <div className="d-flex justify-content-end">
            <span className="caption-small text-light-gray">
              {amounts[1]}{" "}
              <TokenSymbolView name={symbols[1]} className="ps-1 caption-small text-uppercase text-light-gray"/>
            </span>
          </div>
        )}
      </div>
    </li>
  );
}
