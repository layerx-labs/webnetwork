import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";

import {useAppState} from "contexts/app-state";

import { Token } from "interfaces/token";

import useCoingeckoPrice from "x-hooks/use-coingecko-price";

import PriceConversorModalView from "./view";

interface IPriceConversiorModalProps {
  show: boolean;
  onClose: ()=> void;
  value?: BigNumber;
  token: Token;
  symbol: string;
}
interface Options {
  value: string;
  label: string;
}

const defaultValue: Options[] = [{value: "usd", label: "US Dollar"}, {value: "eur", label: "Euro"}]

export default function PriceConversorModal({
  show,
  onClose,
  value,
  token,
  symbol
}:IPriceConversiorModalProps) {

  const [options, setOptions] = useState<Options[]>(defaultValue);
  const [currentValue, setValue] = useState<number>(value?.toNumber() || 0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentToken, setCurrentToken] = useState<string>();
  const [errorCoinInfo, setErrorCoinInfo] = useState<boolean>(false);
  const [currentCurrency, setCurrentCurrency] = useState<{label: string, value: string}>(defaultValue[0]);

  const {state} = useAppState();

  const { getPriceFor } = useCoingeckoPrice();

  async function handlerChange({value, label}: Options){
    const currency = value.toLowerCase()
    if (!token) return;

    const data = await getPriceFor([
      { address: token.address, chainId: token.chain_id },
    ])
      .then((prices) => {
        if (!prices[0][currency]) setErrorCoinInfo(true);
        return { prices: prices[0][currency] || 0 };
      })
      .catch((err) => {
        if (err) setErrorCoinInfo(true);
        return { prices: { [currency]: 0 } };
      });

    if(data.prices[currency] > 0) setErrorCoinInfo(false)
    setCurrentCurrency({value, label});
    setCurrentToken(value.toUpperCase())
    setCurrentPrice(data.prices);
  }

  useEffect(()=>{
    if (!state.Settings?.currency?.conversionList) return;

    const { conversionList } = state.Settings.currency

    const opt = conversionList.map(currency=>({value: currency?.value, label: currency?.label}))
    setOptions(opt)
    handlerChange(opt[0])
    
  },[state.Settings?.currency?.conversionList])


  return (
    <PriceConversorModalView 
      show={show} 
      onClose={onClose} 
      symbol={symbol} 
      currentValue={currentValue} 
      handleCurrentValue={setValue} 
      currentPrice={currentPrice} 
      currentToken={currentToken} 
      errorCoinInfo={errorCoinInfo} 
      currentCurrency={currentCurrency} 
      options={options} 
      handleSelectChange={handlerChange}    
    />
  );
}
