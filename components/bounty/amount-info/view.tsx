import { OverlayTrigger, Tooltip } from "react-bootstrap";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import {
  formatNumberToNScale,
  formatStringToCurrency,
} from "helpers/formatNumber";

interface BountyAmountViewProps {
  symbol: string;
  bountyAmount: BigNumber;
  isActive: boolean;
  size: "sm" | "lg";
}

export default function BountyAmountView({
  bountyAmount,
  symbol,
  isActive,
  size = "lg",
}: BountyAmountViewProps) {
  const { t } = useTranslation(["bounty", "common"]);

  return (
    <OverlayTrigger
      key="bottom-amount"
      placement="bottom"
      overlay={
        <Tooltip id={"tooltip-amount-bottom"} className="caption-small">
          {formatStringToCurrency(bountyAmount?.toFixed())}{" "}
          {symbol || t("common:misc.token")}
        </Tooltip>
      }
    >
      <div
        className={`base-medium text-truncate`}
      >
        <div className={`d-flex gap-2 px-0 align-items-center justify-content-center 
          text-truncate ${size === "sm" && "text-center"}`}>
          <span
            className={`text-opacity-1 text-white sm-regular`}
          >
            ${(+bountyAmount >= 1e-6 &&
              formatNumberToNScale(bountyAmount?.toFixed())) ||
              bountyAmount?.toExponential()}
          </span>
          <div className="text-truncate token-symbol">
            <span className="text-uppercase sm-regular text-gray-500">
              {symbol || t("common:misc.token")}
            </span>
          </div>
        </div>
      </div>
    </OverlayTrigger>
  );
}
