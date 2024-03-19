import {useTranslation} from "next-i18next";

import ArrowUpRight from "assets/icons/arrow-up-right";

import Button from "components/button";
import {FlexColumn, FlexRow} from "components/common/flex-box/view";
import {ResponsiveEle} from "components/responsive-wrapper";

import If from "../../../../If";
import NetworkItemAmountView from "../../amount/view";


interface BodyVotingViewProps {
  handleNetworkLink: () => void;
  type: "network" | "voting" | "payments";
  amount: string | number;
  symbol: string;
  isNetworkVariant: boolean;
  primaryColor: string;
}

export default function BodyVotingView({
  amount,
  symbol,
  isNetworkVariant,
  primaryColor,
  handleNetworkLink
}: BodyVotingViewProps) {
  const { t } = useTranslation(["profile"]);

  function NetworkLinkIconButton({ className = "" }) {
    return (
      <div
        className={`${className} py-0 mt-1 ms-4 cursor-pointer border border-gray-700 bg-gray-850 border-radius-4`}
        onClick={handleNetworkLink}
      >
        <ArrowUpRight />
      </div>
    );
  }

  function RenderAmount() {
    return (
      <NetworkItemAmountView
        amount={amount}
        symbol={symbol}
        isNetworkVariant={isNetworkVariant}
        primaryColor={primaryColor}
      />
    );
  }

  return (
<>
      <FlexColumn className="justify-content-center py-3 ms-2">
        <FlexRow>
          <RenderAmount />
          <If condition={!!handleNetworkLink}
              children={<>
                <ResponsiveEle 
                  tabletView={
                    <Button 
                      className="button-gray-850 ms-3 cursor-pointer" 
                      onClick={handleNetworkLink}
                    >
                      <span>{t("go-to-network")}&nbsp;</span>
                      <ArrowUpRight className="w-9-p h-9-p" />
                    </Button>
                  }
                />
              </>
            } />
        </FlexRow>
      </FlexColumn>
      <If condition={!!handleNetworkLink}
          children={
            <ResponsiveEle 
            tabletView={null}
              mobileView={
                <FlexRow className="justify-content-center">
                    <div><NetworkLinkIconButton className="px-2" /></div>
                </FlexRow>}
            />
          } />
    </>
  );
}
