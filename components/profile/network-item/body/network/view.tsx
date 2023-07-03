import { useTranslation } from "next-i18next";

import ArrowDown from "assets/icons/arrow-down";
import ArrowRightSmall from "assets/icons/arrow-right-small";
import ArrowUp from "assets/icons/arrow-up";
import ArrowUpRight from "assets/icons/arrow-up-right";
import ChevronRightIcon from "assets/icons/chevronright-icon";

import Button from "components/button";
import { FlexColumn } from "components/profile/wallet-balance";
import ResponsiveWrapper from "components/responsive-wrapper";

import NetworkItemAmountView from "../../amount/view";
interface BodyNetworkViewProps {
  isCollapsed: boolean;
  handleNetworkLink: () => void;
  type: "network" | "voting";
  amount: string | number;
  symbol: string;
  isNetworkVariant: boolean;
  primaryColor: string;
  handleToggleCollapse: () => void;
  isArrowRight?: boolean;
}

export default function BodyNetworkView({
  isCollapsed,
  isArrowRight,
  type,
  amount,
  symbol,
  isNetworkVariant,
  primaryColor,
  handleNetworkLink,
  handleToggleCollapse,
}: BodyNetworkViewProps) {
  const { t } = useTranslation(["profile"]);

  function ArrowComponent() {
    if (isCollapsed)
      return isArrowRight ? (
        <ArrowRightSmall width={10} height={10} />
      ) : (
        <ArrowDown width={10} height={8} />
      );

    return <ArrowUp width={14} height={14} />;
  }

  function RenderAmount() {
    return (
      <NetworkItemAmountView
        amount={amount}
        symbol={symbol}
        isNetworkVariant={isNetworkVariant}
        type={type}
        primaryColor={primaryColor}
      />
    );
  }

  return (
    <>
      <ResponsiveWrapper
        lg={true}
        xs={false}
        className="d-flex justify-content-center col-lg-3"
      >
        <RenderAmount />
      </ResponsiveWrapper>
      <ResponsiveWrapper
        lg={true}
        xs={false}
        className="d-flex justify-content-center align-items-center col-lg-3"
      >
          <NetworkLinkIconButton className="px-1 ms-3" />
      </ResponsiveWrapper>
      <div
        className="col-lg-3 col-6 d-flex justify-content-end cursor-pointer"
        onClick={handleToggleCollapse}
      >
        <FlexColumn className="justify-content-center mt-1 text-gray-200">
          <ResponsiveWrapper
            xs={false}
            lg={true}
          >
            <ArrowComponent />
          </ResponsiveWrapper>

          <ResponsiveWrapper
            xs={true}
            lg={false}
          >
            <ChevronRightIcon width={14} height={14} />
          </ResponsiveWrapper>
        </FlexColumn>
      </div>
      <ResponsiveWrapper
        lg={false}
        xs={true}
        className="d-flex flex-column justify-content-center"
      >
        <span className="mt-3 text-gray-500">
          {t("network-columns.total-votes")}
        </span>
        <RenderAmount />
      </ResponsiveWrapper>
    </>
  );
}
