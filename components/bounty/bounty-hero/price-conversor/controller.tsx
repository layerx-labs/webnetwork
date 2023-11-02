import { useState } from "react";

import BigNumber from "bignumber.js";

import { Currency } from "interfaces/currency";
import { Token } from "interfaces/token";

import PriceConversorView from "./view";
import { useAppState } from "contexts/app-state";

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

  const {state} = useAppState();

  return (
    <PriceConversorView
      currentValue={currentValue}
      currency={currency}
      token={token}
      isVisible={isVisible}
      userWalletAddress={state.currentUser?.walletAddress}
      handleIsVisible={setIsVisible}
    />
  );
}
