import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useRouter } from "next/router";

import PaymentsMulti from "components/pages/profile/payments/multi/controller";
import PaymentsNetwork from "components/pages/profile/payments/network/controller";

import { getPricesAndConvert } from "helpers/tokens";

import { PaymentsPageProps } from "types/pages";
import { TotalFiatNetworks } from "types/utils";

import useCoingeckoPrice from "x-hooks/use-coingecko-price";
import { useSettings } from "x-hooks/use-settings";

export default function PaymentsPage({ 
  payments,
  chains,
}: PaymentsPageProps) {
  const router = useRouter();

  const [totalFiat, setTotalFiat] = useState(0);
  const [hasNoConvertedToken, setHasNoConvertedToken] = useState(false);
  const [totalFiatNetworks, setTotalFiatNetworks] = useState<TotalFiatNetworks[]>([]);
  
  const { settings } = useSettings();

  const isNetworkPayments = !!router?.query?.networkName && !!payments?.length;
  const fiatSymbol = settings?.currency?.defaultFiat?.toUpperCase();

  const tokens = payments.flatMap(({ payments }) => payments.map(payment => ({
    address: payment?.issue?.transactionalToken.address,
    chainId: payment?.issue?.transactionalToken.chain_id
  })))

  const {
    data: prices,
    isLoading,
    isSuccess,
  } = useCoingeckoPrice(tokens.length > 0 ? tokens : null);

  useEffect(() => {
    if (!payments?.length || !prices) {
      setTotalFiatNetworks([]);
      setTotalFiat(0);
      return;
    }

    if (!isLoading && isSuccess) {
      const convertableItems = payments.flatMap(({ id, payments }) =>
        payments.map((payment) => ({
          tokenAddress: payment?.issue?.transactionalToken?.address,
          networkId: id,
          value: BigNumber(payment.ammount),
          token: payment.issue.transactionalToken,
        })));

      const { converted, noConverted, totalConverted } =
        getPricesAndConvert<TotalFiatNetworks>(convertableItems,
                                               settings?.currency?.defaultFiat?.toLowerCase(),
                                               prices);

      setTotalFiatNetworks(converted);
      setTotalFiat(totalConverted.toNumber());
      setHasNoConvertedToken(!!noConverted.length);
    }
  }, [payments, prices]);

  if (isNetworkPayments)
    return(
      <PaymentsNetwork
        networkPayments={payments[0]}
        totalConverted={totalFiat}
        defaultFiat={fiatSymbol}
      />
    );

  return(
    <PaymentsMulti
      payments={payments}
      chains={chains}
      fiatSymbol={fiatSymbol}
      totalFiat={totalFiat}
      totalFiatNetworks={totalFiatNetworks}
      hasNoConvertedToken={hasNoConvertedToken}
    />
  );
}
