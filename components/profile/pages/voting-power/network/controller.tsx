import { useEffect } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import Indicator from "components/indicator";

import { useAppState } from "contexts/app-state";

import { useAuthentication } from "x-hooks/use-authentication";
import useChain from "x-hooks/use-chain";

import VotingPowerNetworkView from "./view";

export default function VotingPowerNetwork() {
  const { query } = useRouter();
  const { t } = useTranslation(["common", "profile"]);

  const { state } = useAppState();
  const { updateWalletBalance } = useAuthentication();
  const { chain } = useChain();

  const { curatorAddress } = query;

  const oracleToken = {
    symbol:
      state.Service?.network?.active?.networkToken?.symbol || t("misc.token"),
    name:
      state.Service?.network?.active?.networkToken?.name ||
      t("profile:oracle-name-placeholder"),
    icon: (
      <Indicator
        bg={state.Service?.network?.active?.colors?.primary}
        size="lg"
      />
    ),
  };

  const votesSymbol = t("token-votes", { token: oracleToken.symbol });

  const oraclesLocked =
    state.currentUser?.balance?.oracles?.locked || BigNumber("0");
  const oraclesDelegatedToMe =
    state.currentUser?.balance?.oracles?.delegatedByOthers || BigNumber("0");

  useEffect(() => {
    if (
      !state.currentUser?.walletAddress ||
      !state.Service?.active?.network ||
      !chain
    )
      return;

    updateWalletBalance(true);
  }, [state.currentUser?.walletAddress]);

  return (
    <VotingPowerNetworkView
      oraclesLocked={oraclesLocked}
      oraclesDelegatedToMe={oraclesDelegatedToMe}
      oracleToken={oracleToken}
      votesSymbol={votesSymbol}
      walletAddress={state.currentUser?.walletAddress}
      userBalance={state.currentUser?.balance}
      userIsCouncil={state.Service?.network?.active?.isCouncil}
      userIsGovernor={state.Service?.network?.active?.isGovernor}
      handleUpdateWalletBalance={() => updateWalletBalance(true)}
      delegationAddress={curatorAddress?.toString()}
    />
  );
}
