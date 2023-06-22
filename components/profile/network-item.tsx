import { ReactNode, useState } from "react";

import { useTranslation } from "next-i18next";

import ArrowDown from "assets/icons/arrow-down";
import ArrowUp from "assets/icons/arrow-up";
import ArrowUpRight from "assets/icons/arrow-up-right";

import Button from "components/button";
import TokenSymbolView from "components/common/token-symbol/view";
import NetworkLogo from "components/network-logo";
import ResponsiveWrapper from "components/responsive-wrapper";

import { useAppState } from "contexts/app-state";

import { formatNumberToCurrency } from "helpers/formatNumber";

import { FlexColumn, FlexRow } from "./wallet-balance";

export default function NetworkItem({
  key,
  children,
  type,
  amount,
  symbol,
  handleNetworkLink,
  iconNetwork,
  networkName,
  subNetworkText,
  primaryColor,
  variant = "network"
}: {
  children?: ReactNode;
  key?: number | string;
  type?: "network" | "voting";
  networkName: string;
  subNetworkText?: string;
  primaryColor?: string;
  iconNetwork: string | ReactNode;
  amount: string | number;
  symbol: string;
  handleNetworkLink?: () => void;
  variant?: "network" | "multi-network";
}) {
  const { t } = useTranslation(["profile"]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const {
    state: { Settings: settings }
  } = useAppState();

  const isNetworkVariant = variant === "network";
  const isNetworkType = type === "network";

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

  function renderAmount() {
    return (
      <FlexRow className={`${type === "voting" && "caption-medium"} flex-wrap text-truncate mt-2`}>
        <span className="text-white mr-1">
          {formatNumberToCurrency(amount)}
        </span>
        <TokenSymbolView
          name={symbol}
          className={`${isNetworkVariant ? "text-primary" : ""} text-uppercase`}
          style={{ color: primaryColor }}
        />
      </FlexRow>
    );
  }

  function toggleCollapse() {
    setIsCollapsed(previous => !previous);
  }

  function renderType() {
    return (
      <>
        <FlexRow className={`${!isNetworkType && "justify-content-between"} flex-wrap`}>
          <FlexRow className={`${isNetworkType && "col-lg-3 col-6"}`}>
            <FlexColumn className="justify-content-center me-2">
            { typeof iconNetwork === "string" ? <NetworkLogo
                src={`${settings?.urls?.ipfs}/${iconNetwork}`}
                alt={`${networkName} logo`}
                isBepro={networkName?.toLowerCase() === "bepro"}
                size="md"
              /> : iconNetwork }
            </FlexColumn>
            <FlexColumn className="justify-content-center">
              <FlexRow className="flex-wrap">{networkName}</FlexRow>

              {subNetworkText && (
                <FlexRow className="d-none d-sm-block">
                  <span className="text-gray">{subNetworkText}</span>
                </FlexRow>
              )}
            </FlexColumn>
          </FlexRow>
          <FlexRow className="d-sm-none justify-content-end">
            <span className="text-gray">{subNetworkText}</span>
          </FlexRow>
          {isNetworkType ? (
            <>
            <ResponsiveWrapper lg={true} xs={false} className="d-flex justify-content-center col-lg-3">
              {renderAmount()}
            </ResponsiveWrapper>
              <ResponsiveWrapper lg={true} xs={false} className="d-flex justify-content-center col-lg-3 ">
                <FlexColumn className="justify-content-center">
                  <NetworkLinkIconButton className="px-1"/>
                </FlexColumn>
              </ResponsiveWrapper>
              <div
                className="col-lg-3 col-6 d-flex justify-content-end cursor-pointer"
                onClick={toggleCollapse}
              >
                <FlexColumn className="justify-content-center mt-1">
                  <ArrowComponent />
                </FlexColumn>
              </div>
              <ResponsiveWrapper lg={false} xs={true} className="d-flex flex-column justify-content-center">
                <span className="mt-3 text-gray-500">{t("network-columns.total-votes")}</span>
                {renderAmount()}
              </ResponsiveWrapper>
            </>
          ) : (
            <>
            <FlexColumn className="justify-content-center ms-2">
              <FlexRow>
                {renderAmount()}
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
          )}
        </FlexRow>

        {(children && !isCollapsed) && <FlexRow className="mt-3">{children}</FlexRow>}
      </>
    );
  }

  return (
    <div
      className={
        `bg-gray-${ !isNetworkVariant && isNetworkType ? "900" : "950"} p-3 border border-gray-800 border-radius-4 my-2`
      }
      key={key}
    >
      {renderType()}
    </div>
  );
}
