import { OverlayTrigger, Tooltip } from "react-bootstrap";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import { MIN_RENDER_AMOUNT } from "helpers/constants";
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
        className={`m-0 base-medium text-truncate px-2 py-1 border-radius-4 border border-gray-800 ${
          !isActive ? "bg-gray-950" : "bg-dark-gray"
        } `}
      >
        <div className={`d-flex gap-2 px-0 justify-content-center text-truncate ${size === "sm" && "text-center"}`}>
          <span
            className={`text-opacity-1 text-white${isActive && "-40"}`}
          >
            {(+bountyAmount >= MIN_RENDER_AMOUNT &&
              formatNumberToNScale(bountyAmount?.toFixed())) ||
              `< ${MIN_RENDER_AMOUNT}`}
          </span>
          <div className="text-truncate token-symbol">
            <span className={`text-uppercase text-gray-500 `}>
              {symbol || t("common:misc.token")}
            </span>
          </div>
        </div>
      </div>
    </OverlayTrigger>
  );
}
