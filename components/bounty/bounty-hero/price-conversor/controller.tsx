import { useState } from "react";

import BigNumber from "bignumber.js";

import { Currency } from "interfaces/currency";
import { Token } from "interfaces/token";

import PriceConversorView from "./view";

interface IPriceConversorProps {
  currentValue: BigNumber;
  currency: Currency | string;
  token: Token;
}

export default function PriceConversor({
  currentValue,
  currency,
  token
}: IPriceConversorProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <PriceConversorView
      currentValue={currentValue}
      currency={currency}
      token={token}
      isVisible={isVisible}
      handleIsVisible={setIsVisible}
    />
  );
}
