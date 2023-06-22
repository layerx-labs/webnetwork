import { useTranslation } from "next-i18next";

import ArrowDown from "assets/icons/arrow-down";
import ArrowUp from "assets/icons/arrow-up";
import ArrowUpRight from "assets/icons/arrow-up-right";

import Button from "components/button";
import ResponsiveWrapper from "components/responsive-wrapper";

import { FlexColumn, FlexRow } from "../wallet-balance";
import NetworkItemAmountView from "./amount.view";

interface NetworkItemBodyViewProps {
  isCollapsed: boolean;
  handleNetworkLink: () => void;
  type: "network" | "voting";
  amount: string | number;
  symbol: string;
  isNetworkVariant: boolean;
  primaryColor?: string;
  isNetworkType: boolean;
  handleToggleCollapse: () => void;
}

export default function NetworkItemBodyView({
  isCollapsed,
  type,
  amount,
  symbol,
  isNetworkVariant,
  primaryColor,
  handleNetworkLink,
  isNetworkType,
  handleToggleCollapse,
}: NetworkItemBodyViewProps) {
  const { t } = useTranslation(["profile"]);

  function ArrowComponent() {
    if (isCollapsed) return <ArrowDown width={10} height={8} />;

    return <ArrowUp width={10} height={8} />;
  }

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
        type={type}
        primaryColor={primaryColor}
      />
    );
  }

  if (isNetworkType)
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
          className="d-flex justify-content-center col-lg-3 "
        >
          <FlexColumn className="justify-content-center">
            <NetworkLinkIconButton className="px-1" />
          </FlexColumn>
        </ResponsiveWrapper>
        <div
          className="col-lg-3 col-6 d-flex justify-content-end cursor-pointer"
          onClick={handleToggleCollapse}
        >
          <FlexColumn className="justify-content-center mt-1">
            <ArrowComponent />
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

  return (
    <>
      <FlexColumn className="justify-content-center ms-2">
        <FlexRow>
          <RenderAmount />
          {handleNetworkLink && (
            <ResponsiveWrapper xl={true} lg={true} md={true} xs={false}>
              <Button
                className="button-gray-850 ms-3 cursor-pointer"
                onClick={handleNetworkLink}
              >
                <span>{t("go-to-network")}&nbsp;</span>
                <ArrowUpRight className="w-9-p h-9-p" />
              </Button>
            </ResponsiveWrapper>
          )}
        </FlexRow>
      </FlexColumn>
      {handleNetworkLink && (
        <ResponsiveWrapper xl={false} lg={false} md={false} xs={true}>
          <FlexRow className="justify-content-center">
            <div>
              <NetworkLinkIconButton className="px-2" />
            </div>
          </FlexRow>
        </ResponsiveWrapper>
      )}
    </>
  );
}
