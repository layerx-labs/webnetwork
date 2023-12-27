
import {GetServerSideProps} from "next";

import CustomContainer from "components/custom-container";
import { NewNetworkStepper } from "components/custom-network/new-network-stepper";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

export default function NewMarketplacePage() {
  return (
    <CustomContainer className="py-5">
      <NewNetworkStepper />
    </CustomContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    props: {
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "custom-network",
        "connect-wallet-button",
        "change-token-modal"
      ])),
    },
  };
};
