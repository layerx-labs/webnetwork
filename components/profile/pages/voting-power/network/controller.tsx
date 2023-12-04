import { useEffect } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useUserStore } from "x-hooks/stores/user/user.store";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useAuthentication } from "x-hooks/use-authentication";
import useChain from "x-hooks/use-chain";
import useOracleToken from "x-hooks/use-oracle-token";

import VotingPowerNetworkView from "./view";

export default function VotingPowerNetwork() {
  const { query } = useRouter();
  const { t } = useTranslation(["common", "profile"]);

  const { updateWalletBalance } = useAuthentication();
  const { chain } = useChain();
  const { currentOracleToken } = useOracleToken();
  const { service: daoService } = useDaoStore();
  const { currentUser } = useUserStore();

  const { curatorAddress } = query;


  const votesSymbol = t("token-votes", { token: currentOracleToken.symbol });

  const oraclesLocked =
    currentUser?.balance?.oracles?.locked || BigNumber("0");
  const oraclesDelegatedToMe =
    currentUser?.balance?.oracles?.delegatedByOthers || BigNumber("0");
  const oraclesDelegatedToOthers = currentUser?.balance?.oracles?.delegations?.reduce((acc, curr) => 
    acc.plus(curr?.amount), BigNumber("0")) || BigNumber("0");

  useEffect(() => {
    if (
      !currentUser?.walletAddress ||
      !daoService?.network ||
      !chain
    )
      return;

    updateWalletBalance(true);
  }, [currentUser?.walletAddress]);

  return (
    <VotingPowerNetworkView
      oraclesLocked={oraclesLocked}
      oraclesDelegatedToMe={oraclesDelegatedToMe}
      oraclesDelegatedToOthers={oraclesDelegatedToOthers}
      oracleToken={currentOracleToken}
      votesSymbol={votesSymbol}
      walletAddress={currentUser?.walletAddress}
      userBalance={currentUser?.balance}
      userIsCouncil={currentUser?.isCouncil}
      userIsGovernor={currentUser?.isGovernor}
      handleUpdateWalletBalance={() => updateWalletBalance(true)}
      delegationAddress={curatorAddress?.toString()}
    />
  );
}
