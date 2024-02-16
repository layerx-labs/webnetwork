export function Number({number, symbol, separator = "."}: {symbol?: string; number: string; separator?: string}) {
  const [_number, _decimal] = number.toString().split(separator);
  const regex = /0(0+)/
  const matcher = _decimal.match(regex);
  const zerosAmount = matcher ? matcher[0].length : 0;

  const decimal = zerosAmount ? _decimal.replace(regex, "") : _decimal;
  return <>{symbol ? <>{symbol} </> : ""}{_number}{separator}{zerosAmount ? <>0<sub>{zerosAmount}</sub></> : ""}{decimal}</>
}