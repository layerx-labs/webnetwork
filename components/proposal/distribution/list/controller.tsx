import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import ProposalDistributionListView from "components/proposal/distribution/list/view";

import { useAppState } from "contexts/app-state";

import { DistributedAmounts } from "interfaces/proposal";
import { Token, TokenInfo } from "interfaces/token";

import useCoingeckoPrice from "x-hooks/use-coingecko-price";

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

  const { getPriceFor } = useCoingeckoPrice();

  const defaultFiat = state.Settings?.currency?.defaultFiat || 'usd';

  async function getCoinInfo() {
    if(!token) return;
    const { address, chain_id } = token
    
    await getPriceFor([{ address, chainId: chain_id }])
      .then((prices) => {
        setCoinInfo({
          ...token,
          prices: prices[0]
        })
      }).catch((error) => console.debug("getCoinInfo", error));      
  }

  const handleConversion = (value) =>
    BigNumber(value)
      .multipliedBy(coinInfo?.prices[defaultFiat?.toLowerCase()] || 0)
      .toFixed(4);

  useEffect(() => {
    if (state.Service?.network?.amounts) getCoinInfo();
  }, [state.Service?.network?.amounts]);

  return (
    <ProposalDistributionListView
      distributedAmounts={distributedAmounts}
      transactionalTokenSymbol={token.symbol || t("common:misc.token")}
      fiatSymbol={defaultFiat}
      convertValue={handleConversion}
    />
  );
}
