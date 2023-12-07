
import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

import CustomContainer from "components/custom-container";
import { NewNetworkStepper } from "components/custom-network/new-network-stepper";

export default function NewMarketplacePage() {
  return (
    <CustomContainer className="py-5">
      <NewNetworkStepper />
    </CustomContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "custom-network",
        "connect-wallet-button",
        "change-token-modal"
      ])),
    },
  };
};
