import TokenSymbolView from "components/common/token-symbol/view";
import InfoTooltip from "components/info-tooltip";
import {ResponsiveEle} from "components/responsive-wrapper";

import {formatStringToCurrency} from "helpers/formatNumber";

import useBreakPoint from "../../../../../x-hooks/use-breakpoint";
import If from "../../../../If";

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
  infoTooltip?: string;
  total?: string;
  votesSymbol?: string;
  propsMobile: ResponsiveProps;
  propsDesktopAndTablet: ResponsiveProps;
  getTextColorProps: () => { className: string } | { style: { color: string } };
  getTitleSpanClass: (type: string) => string;
  getAmountClass: (type: string) => string;
}) {

  const {isMobileView, isTabletView} = useBreakPoint(true)

  function renderAmount({icon}: { icon: boolean }) {
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

      <ResponsiveEle mobileView={<span className={getTitleSpanClass("fs-small")}>{label}</span>}
                     tabletView={<span className={getTitleSpanClass("h4")}>{label}</span>}/>

      <If condition={!!total}
          children={
            <ResponsiveEle 
              className={`${isMobileView && isTabletView && "fs-smallest" || "caption-medium"}`}
              mobileView={<span className="fs-smallest">{renderAmount({icon: !(isMobileView && isTabletView)})}</span>}
              />}
      />
    </>
  );
}
