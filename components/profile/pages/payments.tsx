import {ChangeEvent, SetStateAction, useEffect, useState} from "react";

import {format, subDays} from "date-fns";
import {useTranslation} from "next-i18next";
import { useRouter } from "next/router";

import ArrowRight from "assets/icons/arrow-right";

import If from "components/If";
import NothingFound from "components/nothing-found";
import PaymentsList from "components/profile/payments-list";
import ProfileLayout from "components/profile/profile-layout";
import {FlexColumn, FlexRow} from "components/profile/wallet-balance";
import ReactSelect from "components/react-select";
import ResponsiveWrapper from "components/responsive-wrapper";

import {useAppState} from "contexts/app-state";

import {formatNumberToCurrency} from "helpers/formatNumber";

import {getCoinPrice} from "services/coingecko";

import { NetworkPaymentsData } from "types/api";

import PaymentsNetwork from "./payments-network";

export interface TotalFiatNetworks {
  tokenAddress: string;
  value: number;
  price: number;
  networkId: number;
}

interface PaymentsPageProps {
  payments: NetworkPaymentsData[];
}

export default function PaymentsPage({ payments }: PaymentsPageProps) {
  const { t } = useTranslation(["common", "profile", "custom-network"]);
  const router = useRouter();

  const defaultOptions = [
    {
      value: format(subDays(new Date(), 7), "yyyy-MM-dd").toString(),
      label: `7 ${t("info-data.days_other")}`,
    },
    {
      value: format(subDays(new Date(), 15), "yyyy-MM-dd").toString(),
      label: `15 ${t("info-data.days_other")}`,
    },
    {
      value: format(subDays(new Date(), 30), "yyyy-MM-dd").toString(),
      label: `30 ${t("info-data.days_other")}`,
    },
  ];

  const [totalFiat, setTotalFiat] = useState(0);
  const [totalFiatNetworks, setTotalFiatNetworks] = useState<TotalFiatNetworks[]>([])
  const [hasNoConvertedToken, setHasNoConvertedToken] = useState(false);
  const [option, setOption] = useState<{ value: string; label: string }>(defaultOptions[0]);
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 7), "yyyy-MM-dd").toString());
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd").toString());
  
  const {state} = useAppState();

  function onChangeSelect(e: { value: string; label: string }) {
    setStartDate(e.value);
    setEndDate(format(new Date(), "yyyy-MM-dd").toString());
    setOption({
      value: e.value,
      label: e.label,
    });
  }

  useEffect(() => {
    if (!payments?.length) return;

    Promise.all(payments.flatMap(({ payments }) => payments.map(async (payment) => ({
      tokenAddress: payment?.issue?.transactionalToken?.address,
      value: payment.ammount,
      price: await getCoinPrice(payment?.issue?.transactionalToken?.symbol, state?.Settings?.currency?.defaultFiat),
      networkId: payment?.issue?.network_id
    }))))
      .then((tokens) => {
        const totalConverted = tokens.reduce((acc, token) => acc + token.value * (token.price || 0), 0);
        const noConverted = !!tokens.find((token) => token.price === undefined);
        
        setTotalFiatNetworks(tokens)
        setTotalFiat(totalConverted);
        setHasNoConvertedToken(noConverted);
      });
  }, [payments]);

  function onChangeDate(e: ChangeEvent<HTMLInputElement>,
                        setState: (value: SetStateAction<string>) => void) {
    setOption({ value: "-", label: "-" });
    setState(e.target.value);
  }

  function TotalReceived() {
    if (hasNoConvertedToken)
      return(
        <span className="caption-small text-danger">
          {t("currencies.error-convert-all-to-euro")}
        </span>
      );

    return(
      <>
        <span className="caption-medium font-weight-medium text-capitalize text-white mr-2">
          {t("labels.recivedintotal")}
        </span>

        <div className="caption-large font-weight-medium bg-gray-900 py-2 px-3 border-radius-4">
          <span className="text-white">
            {formatNumberToCurrency(totalFiat)}
          </span>

          <span className="text-gray-600 ml-1">{state?.Settings?.currency?.defaultFiat}</span>
        </div>
      </>
    );
  }

  if (router?.query?.networkName && router?.query?.networkChain)
    return <PaymentsNetwork
      payments={payments[0]}
      totalConverted={totalFiatNetworks?.reduce((acc, curr) => acc + (curr?.value * curr?.price), 0)}
      defaultFiat={state?.Settings?.currency?.defaultFiat}
    />

  return (
    <>
      <ResponsiveWrapper 
        xs={true}
        xl={false}
        className={`align-items-center justify-content-between mb-2 border-bottom 
        border-gray-850 border-xl-0 pb-3 px-3`}
      >
        <FlexColumn>
          <h4 className="text-white font-weight-medium">{t("main-nav.nav-avatar.payments")}</h4>
        </FlexColumn>

        <ResponsiveWrapper xs={false} lg={true}>
          <FlexRow className="align-items-center">
            <TotalReceived />
          </FlexRow>
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
            <div className="col-2">
              <div className="d-flex align-items-center gap-2">
                <label className="text-capitalize text-white font-weight-normal caption-medium">
                  {t("misc.latest")}
                </label>

                <ReactSelect
                  options={defaultOptions}
                  value={option}
                  onChange={onChangeSelect}
                />
              </div>
            </div>

            <div className="col">
              <div className="d-flex align-items-center gap-2">
                <label className="text-capitalize text-white font-weight-normal caption-medium">
                  {t("profile:payments.period")}
                </label>

                <input
                  type="date"
                  key="startDate"
                  className="form-control"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeDate(e, setStartDate)
                  }
                  value={startDate}
                  max={endDate}
                  />
                <span>
                  <ArrowRight height="10px" width="10px" />
                </span>

                <input
                  type="date"
                  key="endDate"
                  className="form-control"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeDate(e, setEndDate)
                  }
                  value={endDate}
                  max={format(new Date(), "yyyy-MM-dd").toString()}
                />
              </div>
            </div>

            <div className="col-2">
              <div className="d-flex align-items-center gap-2">
                <label className="text-capitalize text-white font-weight-normal caption-medium">
                  Chain
                </label>

                <ReactSelect
                  options={defaultOptions}
                  value={option}
                  onChange={onChangeSelect}
                  />
              </div>
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
