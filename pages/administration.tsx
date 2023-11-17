import React, {useEffect, useState} from "react";

import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import router from "next/router";

import NetworksStep from "components/administration/networks-step";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import Stepper from "components/stepper";

import {Network} from "interfaces/network";

import { useSearchNetworks } from "x-hooks/api/marketplace";
import useMarketplace from "x-hooks/use-marketplace";

import {useAppState} from "../contexts/app-state";

export default function AdministrationPage() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const { state } = useAppState();
  const marketplace = useMarketplace();

  function handleChangeStep(stepToGo) {
    setCurrentStep(stepToGo === currentStep ? 0 : stepToGo);
  }

  useEffect(() => {
    if (!marketplace?.active) return;

    if (!state.currentUser?.isGovernor)
      router.push("/marketplaces");
    else
      useSearchNetworks({})
        .then(({ count, rows }) => {
          if (count > 0) setNetworks(rows);
        })
        .catch((error) => {
          console.log("Failed to retrieve networks list", error);
        });

  }, [marketplace?.active]);

  return (
    <div className="container">
      <ConnectWalletButton asModal={true} />
      <br />
      <br />

      <Stepper>
        <NetworksStep step={1} currentStep={currentStep} networks={networks} handleChangeStep={handleChangeStep} />
      </Stepper>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "connect-wallet-button",
        "custom-network"
      ]))
    }
  };
};
