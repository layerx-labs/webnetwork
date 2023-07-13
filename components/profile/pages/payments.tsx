import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import If from "components/If";
import ChainFilter from "components/lists/filters/chain/controller";
import IntervalFilters from "components/lists/filters/interval/controller";
import PaymentsList from "components/lists/payments/controller";
import PaymentsListMobileFilters from "components/lists/payments/mobile-filters/controller";
import NothingFound from "components/nothing-found";
import PaymentsNetwork from "components/profile/pages/payments-network";
import ProfileLayout from "components/profile/profile-layout";
import { FlexColumn, FlexRow } from "components/profile/wallet-balance";
import ResponsiveWrapper from "components/responsive-wrapper";

import { useAppState } from "contexts/app-state";

import { formatNumberToCurrency } from "helpers/formatNumber";
import { toLower } from "helpers/string";
import { getPricesAndConvert } from "helpers/tokens";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { NetworkPaymentsData } from "types/api";

import useQueryFilter from "x-hooks/use-query-filter";

export interface TotalFiatNetworks {
  tokenAddress: string;
  value: number;
  price: number;
  networkId: number;
}

interface PaymentsPageProps {
  payments: NetworkPaymentsData[];
  chains: SupportedChainData[];
}

export default function PaymentsPage({ 
  payments,
  chains,
}: PaymentsPageProps) {
  const { t } = useTranslation(["common", "profile", "custom-network"]);
  const router = useRouter();

  const [totalFiat, setTotalFiat] = useState(0);
  const [hasNoConvertedToken, setHasNoConvertedToken] = useState(false);
  const [totalFiatNetworks, setTotalFiatNetworks] = useState<TotalFiatNetworks[]>([]);
  
  const { state } = useAppState();
  const { value, setValue } = useQueryFilter({ wallet: null });

  const intervalOptions = [7, 15, 30];

  function TotalReceived() {
    if (hasNoConvertedToken)
      return(
        <span className="caption-small text-danger">
          {t("currencies.error-convert-all-to-euro")}
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

          <span className="text-gray-600 ml-1">{state?.Settings?.currency?.defaultFiat}</span>
        </div>
      </>
    );
  }

  useEffect(() => {
    if (!payments?.length) {
      setTotalFiatNetworks([]);
      setTotalFiat(0);
      return;
    }

    const convertableItems = payments.flatMap(({ id, payments }) => payments.map(payment => ({
      tokenAddress: payment?.issue?.transactionalToken?.address,
      networkId: id,
      value: BigNumber(payment.ammount),
      token: payment.issue.transactionalToken
    })));

    getPricesAndConvert<TotalFiatNetworks>(convertableItems, state?.Settings?.currency?.defaultFiat)
      .then(({ converted, noConverted, totalConverted }) => {      
        setTotalFiatNetworks(converted);
        setTotalFiat(totalConverted.toNumber());
        setHasNoConvertedToken(!!noConverted.length);
      });
  }, [payments]);

  useEffect(() => {
    if (!value?.wallet || toLower(value?.wallet) !== toLower(state.currentUser?.walletAddress))
      setValue({ wallet: state.currentUser?.walletAddress || "" }, true);
  }, [state.currentUser?.walletAddress]);

  if (router?.query?.networkName && payments?.length)
    return <PaymentsNetwork
      networkPayments={payments[0]}
      totalConverted={totalFiatNetworks?.reduce((acc, curr) => acc + (curr?.value * curr?.price), 0)}
      defaultFiat={state?.Settings?.currency?.defaultFiat}
    />;

  return (
    <>
      <ResponsiveWrapper 
        xs={true}
        xl={false}
        className={`align-items-center justify-content-between mb-2 border-bottom 
        border-gray-850 border-xl-0 pb-3 px-3 mt-2`}
      >
        <FlexColumn>
          <h4 className="text-white font-weight-medium">{t("main-nav.nav-avatar.payments")}</h4>
        </FlexColumn>

        <ResponsiveWrapper xs={false} lg={true}>
          <FlexRow className="align-items-center">
            <TotalReceived />
          </FlexRow>
        </ResponsiveWrapper>

        <ResponsiveWrapper xs={true} lg={false}>
          <PaymentsListMobileFilters
            defaultInterval={intervalOptions[0]}
            intervals={intervalOptions}
            chains={chains}
          />
        </ResponsiveWrapper>
      </ResponsiveWrapper>

      <ProfileLayout>
        <div className="col-12">
          <ResponsiveWrapper 
            xs={false}
            xl={true}
            className={`align-items-center justify-content-between mb-2 border-bottom 
            border-gray-850 border-xl-0 pb-3`}
          >
            <FlexColumn>
              <h3 className="text-white font-weight-medium">{t("main-nav.nav-avatar.payments")}</h3>
            </FlexColumn>

            <ResponsiveWrapper xs={false} md={true}>
              <FlexRow className="align-items-center">
                <TotalReceived />
              </FlexRow>
            </ResponsiveWrapper>
          </ResponsiveWrapper>

          <ResponsiveWrapper xs={true} lg={false}>
            <FlexRow className="align-items-center justify-content-between w-100 mb-3">
              <TotalReceived />
            </FlexRow>
          </ResponsiveWrapper>

          <ResponsiveWrapper
            xs={false}
            lg={true}
            className="row align-items-center mb-4"
          >
            <div className="col">
              <IntervalFilters
                defaultInterval={intervalOptions[0]}
                intervals={intervalOptions}
              />
            </div>

            <div className="col-3">
              <ChainFilter
                chains={chains}
              />
            </div>
          </ResponsiveWrapper>

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
                  symbol={state?.Settings?.currency?.defaultFiat?.toUpperCase()}
                />
              </If>
            </FlexColumn>
          </FlexRow>
        </div>
      </ProfileLayout>
    </>
  );
}
