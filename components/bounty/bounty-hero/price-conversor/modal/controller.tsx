import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";

import { Token } from "interfaces/token";

import useCoingeckoPrice from "x-hooks/use-coingecko-price";
import { useSettings } from "x-hooks/use-settings";

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
  const [currentValue, setValue] = useState<number>(value?.decimalPlaces(5)?.toNumber() || 0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentToken, setCurrentToken] = useState<string>();
  const [errorCoinInfo, setErrorCoinInfo] = useState<boolean>(false);
  const [currentCurrency, setCurrentCurrency] = useState<{label: string, value: string}>(defaultValue[0]);

  const { settings } = useSettings();

  const {
    data: prices,
    isFetching,
    isError,
  } = useCoingeckoPrice(token?.address && token?.chain_id
      ? [{ address: token?.address, chainId: token?.chain_id }]
      : null);

  async function handlerChange({value, label}: Options){
    const currency = value.toLowerCase()
    if (!token || !prices) return;

    if (!prices[0][currency] || isError) setErrorCoinInfo(true);

    if(prices[currency] > 0) setErrorCoinInfo(false)
    setCurrentCurrency({value, label});
    setCurrentToken(value.toUpperCase())
    setCurrentPrice(prices[0][currency] || 0);
  }

  useEffect(()=>{
    if (!settings?.currency?.conversionList && !prices) return;

    const { conversionList } = settings.currency

    const opt = conversionList?.map(currency=>({value: currency?.value, label: currency?.label}))
    setOptions(opt)
    handlerChange(opt.find(v => v.value === defaultValue[0].value) || opt[0])
    
  },[settings?.currency?.conversionList, prices])


  return (
    <PriceConversorModalView 
      show={show} 
      onClose={onClose} 
      symbol={symbol} 
      isLoadingPrice={isFetching}
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
