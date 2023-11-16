import { useState } from "react";

import BigNumber from "bignumber.js";

import { Token } from "interfaces/token";

import PriceConversorView from "./view";

interface IPriceConversorProps {
  currentValue: BigNumber;
  token: Token;
}

export default function PriceConversor({
  currentValue,
  token
}: IPriceConversorProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <PriceConversorView
      currentValue={currentValue}
      token={token}
      isVisible={isVisible}
      handleIsVisible={setIsVisible}
    />
  );
}
