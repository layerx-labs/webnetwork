import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import ProposalDistributionListView from "components/proposal/distribution/list/view";

import { useAppState } from "contexts/app-state";

import { DistributedAmounts } from "interfaces/proposal";
import { Token, TokenInfo } from "interfaces/token";

import useCoingeckoPrice from "x-hooks/use-coingecko-price";
import useMarketplace from "x-hooks/use-marketplace";

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

  const { state } = useAppState();
  const marketplace = useMarketplace();

  const { data: prices } = useCoingeckoPrice([
    { address: token?.address, chainId: token?.chain_id },
  ]);

  const defaultFiat = state.Settings?.currency?.defaultFiat || "usd";

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
