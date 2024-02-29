import {useTranslation} from "next-i18next";

import {FlexColumn, FlexRow} from "components/common/flex-box/view";
import If from "components/If";
import ChainFilter from "components/lists/filters/chain/controller";
import IntervalFilters from "components/lists/filters/interval/controller";
import PaymentsList from "components/lists/payments/controller";
import PaymentsListMobileFilters from "components/lists/payments/mobile-filters/controller";
import NothingFound from "components/nothing-found";
import DashboardLayout from "components/profile/dashboard-layout";
import {ResponsiveEle} from "components/responsive-wrapper";

import {formatNumberToCurrency} from "helpers/formatNumber";

import {PaymentsPageProps} from "types/pages";
import {TotalFiatNetworks} from "types/utils";

interface PaymentsMultiViewProps extends PaymentsPageProps {
  fiatSymbol: string;
  totalFiat: number;
  intervals: number[];
  defaultInterval: number;
  totalFiatNetworks: TotalFiatNetworks[];
  hasNoConvertedToken?: boolean;
}

export default function PaymentsMultiView({
  payments,
  chains,
  fiatSymbol,
  totalFiat,
  intervals,
  defaultInterval,
  totalFiatNetworks,
  hasNoConvertedToken,
}: PaymentsMultiViewProps) {
  const { t } = useTranslation(["common", "profile", "custom-network"]);

  function TotalReceived() {
    if (hasNoConvertedToken)
      return(
        <span className="caption-small text-danger">
          {t("currencies.error-convert-all-to-fiat", { fiat: fiatSymbol })}
        </span>
      );

    return(
      <>
        <span className="caption-medium font-weight-normal text-capitalize text-white mr-2">
          {t("labels.recivedintotal")}
        </span>

        <div className="caption-large font-weight-medium bg-gray-900 py-2 px-3 border border-gray-850 border-radius-4">
          <span className="text-white">
            {formatNumberToCurrency(totalFiat)}
          </span>

          <span className="text-gray-600 ml-1">{fiatSymbol}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <ResponsiveEle 
        desktopView={null}
        mobileView={
          <div className={`row align-items-center justify-content-between mb-2 border-bottom border-gray-850 
            border-xl-0 pb-3 px-3 mt-2`}>
            <div className="col">
              <h4 className="text-white font-weight-medium">{t("main-nav.nav-avatar.payments")}</h4>
            </div>

            <div className="col-auto pe-0">
              <ResponsiveEle 
                mobileView={
                  <PaymentsListMobileFilters 
                    defaultInterval={defaultInterval}
                    intervals={intervals}
                    chains={chains}
                  />
                }
                desktopView={
                  <FlexRow className="align-items-center">
                    <TotalReceived />
                  </FlexRow>
                }
              />
            </div>
          </div>
        }
      />

      <ResponsiveEle mobileView={<PaymentsListMobileFilters defaultInterval={defaultInterval}
                                                            intervals={intervals}
                                                            chains={chains}/>}
                    desktopView={<FlexRow className="align-items-center"><TotalReceived /></FlexRow>} />
                    
      <DashboardLayout>
        <div className="col-12">
          <ResponsiveEle
            desktopView={
              <div className={`row align-items-center justify-content-between mb-2 border-bottom border-gray-850 
                border-xl-0 pb-3`}>
                <div className="col">
                  <h3 className="text-white font-weight-medium">{t("main-nav.nav-avatar.payments")}</h3>
                </div>

                <ResponsiveEle
                  tabletView={
                    <div className="col-auto">
                      <div className="d-flex align-items-center">
                        <TotalReceived />
                      </div>
                    </div>
                  } 
                />
              </div>
            }
          />

          <ResponsiveEle
            desktopView={null}
            mobileView={
              <FlexRow className="align-items-center justify-content-between w-100 mb-3">
                <TotalReceived />
              </FlexRow>
            }
          />

          <ResponsiveEle
            desktopView={
              <div className="row align-items-center mb-4">
                <div className="col">
                  <IntervalFilters defaultInterval={defaultInterval} intervals={intervals}/>
                </div>

                <div className="col-3">
                  <ChainFilter chains={chains}/>
                </div>
              </div>
            }
          />

          <FlexRow className="justify-content-center">
            <FlexColumn className="col-12">
              <If
                condition={!!payments?.length}
                otherwise={
                  <NothingFound description={t("filters.no-records-found")} />
                }
              >
                <PaymentsList
                  payments={payments}
                  totalNetworks={totalFiatNetworks}
                  symbol={fiatSymbol}
                />
              </If>
            </FlexColumn>
          </FlexRow>
        </div>
      </DashboardLayout>
    </>
  );
}