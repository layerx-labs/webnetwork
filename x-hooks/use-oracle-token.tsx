import { useTranslation } from "next-i18next";

import Indicator from "components/indicator";

import useMarketplace from "x-hooks/use-marketplace";

export default function useOracleToken() {
  const { t } = useTranslation(["common", "profile"]);

  const marketplace = useMarketplace();

  const oracleToken = {
    symbol: marketplace?.active?.networkToken?.symbol || t("misc.token"),
    name: marketplace?.active?.networkToken?.name || t("profile:oracle-name-placeholder"),
    icon: (
      <Indicator
        bg={marketplace?.active?.colors?.primary}
        size="lg"
      />
    ),
  };

  return {
    currentOracleToken: oracleToken,
    name: oracleToken.name,
    symbol: oracleToken.symbol,
    icon: oracleToken.icon
  };
}
