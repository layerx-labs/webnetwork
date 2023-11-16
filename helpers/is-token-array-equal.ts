import { TokenPrice } from "interfaces/token";

interface PricesProps {
    address: string;
    chainId: number;
    last_price_used: TokenPrice;
  }
  
interface getPriceParams {
    address: string;
    chainId: number;
}

export default function isTokenArrayEqual(tokens: getPriceParams[], state: PricesProps[]): boolean {
  if (tokens?.length !== state?.length) {
    return false;
  }

  return tokens?.every((token, index) =>
      token?.address === state[index]?.address &&
      token?.chainId === state[index]?.chainId);
}
