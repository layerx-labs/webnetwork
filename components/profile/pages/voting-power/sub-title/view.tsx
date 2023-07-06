
import TokenSymbolView from "components/common/token-symbol/view";
import InfoTooltip from "components/info-tooltip";
import ResponsiveWrapper from "components/responsive-wrapper";

import { formatStringToCurrency } from "helpers/formatNumber";

interface ResponsiveProps {
  xs: boolean;
  md: boolean;
}

export default function VotingPowerSubTitleView({
  label,
  total,
  votesSymbol,
  propsMobile,
  propsDesktopAndTablet,
  infoTooltip,
  getTextColorProps,
  getTitleSpanClass,
  getAmountClass,
}: {
  label: string;
  infoTooltip: string;
  total: string;
  votesSymbol: string;
  propsMobile: ResponsiveProps;
  propsDesktopAndTablet: ResponsiveProps;
  getTextColorProps: () => { className: string } | { style: { color: string } };
  getTitleSpanClass: (type: string) => string;
  getAmountClass: (type: string) => string;
}) {

  function handleAmount(icon = true) {
    return (
      <>
        <span>
          {formatStringToCurrency(total)}
        </span>

        <TokenSymbolView name={votesSymbol} {...getTextColorProps()} />
        {icon && (
          <InfoTooltip
            description={infoTooltip}
            secondaryIcon
          />
        )}
      </>
    );
  }

  return (
    <>
      <ResponsiveWrapper {...propsMobile}>
        <span className={getTitleSpanClass("fs-smallest")}>
          {label}
        </span>
      </ResponsiveWrapper>
      <ResponsiveWrapper {...propsDesktopAndTablet}>
        <span className={getTitleSpanClass("h4")}>
          {label}
        </span>
      </ResponsiveWrapper>
      <ResponsiveWrapper
        {...propsMobile}
        className={getAmountClass("fs-smallest")}
      >
        {handleAmount(false)}
      </ResponsiveWrapper>
      <ResponsiveWrapper
        {...propsDesktopAndTablet}
        className={getAmountClass("h4")}
      >
        {handleAmount()}
      </ResponsiveWrapper>
    </>
  );
}
