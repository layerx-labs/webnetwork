import React, {useEffect, useState} from "react";

import {GetServerSideProps} from "next";
import router from "next/router";

import NetworksStep from "components/administration/networks-step";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import Stepper from "components/stepper";

import {Network} from "interfaces/network";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { useSearchNetworks } from "x-hooks/api/marketplace";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";

export default function AdministrationPage() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const { currentUser } = useUserStore();
  const marketplace = useMarketplace();

  function handleChangeStep(stepToGo) {
    setCurrentStep(stepToGo === currentStep ? 0 : stepToGo);
  }

  useEffect(() => {
    if (!marketplace?.active) return;

    if (!currentUser?.isGovernor)
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

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    props: {
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "connect-wallet-button",
        "custom-network"
      ]))
    }
  };
};
