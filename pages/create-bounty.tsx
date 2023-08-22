import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateBountyPage from "components/pages/create-bounty/controller";

export default CreateBountyPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // TODO: BEPRO-1841 fetch banned domains list and pass to bannedDomains props
  return {
    props: {
      bannedDomains: [],
      ...(await serverSideTranslations(locale, [
        "common",
        "custom-network",
        "bounty",
        "connect-wallet-button",
      ])),
    },
  };
};
