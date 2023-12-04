import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import ProposalDistributionListView from "components/proposal/distribution/list/view";

import { DistributedAmounts } from "interfaces/proposal";
import { Token, TokenInfo } from "interfaces/token";

import useCoingeckoPrice from "x-hooks/use-coingecko-price";
import { useSettings } from "x-hooks/use-settings";

interface ProposalDistributionListProps {
  distributedAmounts: DistributedAmounts;
  token: Token;
}

export default function ProposalDistributionList({
  distributedAmounts,
  token,
}: ProposalDistributionListProps) {
  const { t } = useTranslation(["common", "proposal"]);

  const [coinInfo, setCoinInfo] = useState<TokenInfo>();

  const { settings } = useSettings();

  const { data: prices } = useCoingeckoPrice([
    { address: token?.address, chainId: token?.chain_id },
  ]);

  const defaultFiat = settings?.currency?.defaultFiat || "usd";

  const handleConversion = (value) =>
    BigNumber(value)
      .multipliedBy(coinInfo?.prices[defaultFiat?.toLowerCase()] || 0)
      .toFixed(4);

  useEffect(() => {
    if (!token || !prices) return;

    setCoinInfo({
      ...token,
      prices: prices[0],
    });
  }, [token, prices]);

  return (
    <ProposalDistributionListView
      distributedAmounts={distributedAmounts}
      transactionalTokenSymbol={token.symbol || t("common:misc.token")}
      fiatSymbol={defaultFiat}
      convertValue={handleConversion}
    />
  );
}
