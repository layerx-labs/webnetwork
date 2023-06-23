import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps} from "next/types";

import ProposalPage from "components/pages/bounty/proposal/controller";

export default ProposalPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "proposal",
        "pull-request",
        "connect-wallet-button"
      ]))
    }
  };
};
