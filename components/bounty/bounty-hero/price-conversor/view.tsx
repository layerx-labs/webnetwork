import BigNumber from "bignumber.js";

import PriceConversorModal from "components/bounty/bounty-hero/price-conversor/modal/controller";

import { formatStringToCurrency } from "helpers/formatNumber";

import { Currency } from "interfaces/currency";
import { Token } from "interfaces/token";

import useBreakPoint from "x-hooks/use-breakpoint";

interface IPriceConversorProps {
  currentValue: BigNumber;
  currency: Currency | string;
  isVisible: boolean;
  handleIsVisible: (v: boolean) => void;
  token: Token;
}

export default function PriceConversorView({
  currentValue,
  currency,
  isVisible,
  token,
  handleIsVisible
}: IPriceConversorProps) {
  const { isDesktopView } = useBreakPoint();

  return (
    <>
    <div onClick={()=> handleIsVisible(true)}
        className={
          `${(!isDesktopView) && 
            'read-only-button-mobile'} py-1 px-2 border border-gray-850 border-radius-4 
            d-flex align-items-center cursor-pointer`}>
      <span className="text-white caption-large font-weight-normal">
        {formatStringToCurrency(currentValue?.toFixed(5) || "0")}
      </span>
      <span className="token-symbol text-truncate text-white-30 ms-2">{currency}</span>
    </div>
    <PriceConversorModal
        value={currentValue}
        token={token}
        symbol={currency}
        show={isVisible}
        onClose={() => handleIsVisible(false)}
      />
    </>
  );
}
