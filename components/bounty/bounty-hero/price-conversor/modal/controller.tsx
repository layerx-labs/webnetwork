import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";

import {useAppState} from "contexts/app-state";

import {getCoinInfoByContract} from "services/coingecko";

import PriceConversorModalView from "./view";

interface IPriceConversiorModalProps {
  show: boolean;
  onClose: ()=> void;
  value?: BigNumber;
  symbol: string;
}
interface Options {
  value: string;
  label: string;
}

const defaultValue = [{value: "usd", label: "US Dollar"}, {value: "eur", label: "Euro"}]

export default function PriceConversorModal({
  show,
  onClose,
  value,
  symbol
}:IPriceConversiorModalProps) {

  const [options, setOptions] = useState<Options[]>([]);
  const [currentValue, setValue] = useState<number>(value?.toNumber() || 0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentToken, setCurrentToken] = useState<string>();
  const [errorCoinInfo, setErrorCoinInfo] = useState<boolean>(false);
  const [currentCurrency, setCurrentCurrency] = useState<{label: string, value: string}>(null);

  const {state} = useAppState();

  async function handlerChange({value, label}: Options){
    if (!symbol) return;

    const data = 
      await getCoinInfoByContract(symbol)
        .catch((err) => {
          if(err) setErrorCoinInfo(true)
          return ({ prices: { [value]: 0 } })
        });

    if(data.prices[value] > 0) setErrorCoinInfo(false)
    setCurrentCurrency({value, label});
    setCurrentToken(value.toUpperCase())
    setCurrentPrice(data.prices[value]);
  }

  useEffect(()=>{
    if (!symbol) return;

    const currencyList = state.Settings?.currency?.conversionList || defaultValue;

    if(currencyList.length){
      const opt = currencyList.map(currency=>({value: currency?.value, label: currency?.label}))
      setOptions(opt)
      handlerChange(opt[0])
    }
    
  },[symbol])

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
