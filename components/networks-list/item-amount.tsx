import {ReactNode} from "react";

import TokenSymbolView from "components/common/token-symbol/view";
import If from "components/If";
import {ResponsiveEle} from "components/responsive-wrapper";

interface ItemAmountProps {
  amount: string | number | ReactNode;
  label: string;
  currency?: string;
}

export default function ItemAmount({
  amount,
  label,
  currency
} : ItemAmountProps) {
  
  function renderAmount (texto = "") {
    const formattedText = texto.slice(0, -1); 
    const lastLetter = texto.slice(-1); 
  
    return (
      <>
        {formattedText}
        <span className="ls-0">{lastLetter}</span>
      </>
    );
  }

  return(
    <div className="d-flex align-items-center gap-2 text-nowrap py-1 px-0 px-md-2">
      <If condition={typeof amount !== "undefined"}>
        <span className="caption-small font-weight-medium text-white">
          {typeof amount === 'string' ? renderAmount(amount) : amount}
        </span>
      </If>

      <If condition={!!currency}>
          <TokenSymbolView
              name={currency}
              className="caption-small font-weight-medium text-primary"
          />
      </If>

      <If condition={!!label}
          children={
          <ResponsiveEle 
            desktopView={null} 
            mobileView={<span className="caption-small font-weight-medium text-gray-500">{label}</span>}/>
          }
      />
    </div>
  );
}