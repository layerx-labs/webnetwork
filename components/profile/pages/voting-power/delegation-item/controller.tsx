import { useState } from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import Indicator from "components/indicator";

import { useAppState } from "contexts/app-state";

import { DelegationExtended, OracleToken } from "interfaces/oracles-state";

import { useAuthentication } from "x-hooks/use-authentication";
import useBepro from "x-hooks/use-bepro";

import DelegationItemView from "./view";

interface DelegationProps {
  type: "toMe" | "toOthers";
  tokenName: string;
  tokenColor?: string;
  delegation?: DelegationExtended;
  variant?: "network" | "multi-network";
}

export default function DelegationItem({
  type,
  tokenName,
  delegation,
  variant = "network",
  tokenColor,
}: DelegationProps) {
  const { t } = useTranslation(["common", "profile"]);

  const [show, setShow] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const { state } = useAppState();

  const { handleTakeBack } = useBepro();

  const { updateWalletBalance } = useAuthentication();

  const isNetworkVariant = variant === "network";
  const delegationAmount = BigNumber(delegation?.amount)?.toFixed() || "0";
  const tokenBalanceType = type === "toMe" ? "oracle" : "delegation";

  const oracleToken: OracleToken = {
    symbol:
      state.Service?.network?.active?.networkToken?.symbol || t("misc.token"),
    name:
      state.Service?.network?.active?.networkToken?.name ||
      t("profile:oracle-name-placeholder"),
    icon: (
      <Indicator
        bg={tokenColor || state.Service?.network?.active?.colors?.primary}
        size="lg"
      />
    ),
  };

  const votesSymbol = t("token-votes", { token: oracleToken?.symbol });

  function handleShow() {
    if (isNetworkVariant) return null;
    setShow(true);
  }

  function handleCancel() {
    setShow(false);
  }

  async function takeBack() {
    handleCancel();
    setIsExecuting(true);

    await handleTakeBack(delegation?.id, delegationAmount, "Oracles").catch(console.debug);

    updateWalletBalance(true);
    setIsExecuting(false);
  }

  return (
    <DelegationItemView
      tokenName={tokenName}
      tokenColor={tokenColor}
      delegation={delegation}
      variant={variant}
      oracleToken={oracleToken}
      delegationAmount={delegationAmount}
      tokenBalanceType={tokenBalanceType}
      votesSymbol={votesSymbol}
      handleShow={handleShow}
      show={show}
      handleCancel={handleCancel}
      isExecuting={isExecuting}
      takeBack={takeBack}
    />
  );
}
