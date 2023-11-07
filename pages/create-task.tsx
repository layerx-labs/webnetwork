import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CreateTaskPage from "components/pages/bounty/create-task/controller";

import { useSearchNetworks } from "x-hooks/api/network/use-search-networks";

export default CreateTaskPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const networks = await useSearchNetworks({
    isRegistered: true,
    isClosed: false,
    sortBy: "name",
    order: "asc",
    isNeedCountsAndTokensLocked: true,
  });

  return {
    props: {
      networks: networks.rows,
      ...(await serverSideTranslations(locale, [
        "common",
        "custom-network",
        "bounty",
        "connect-wallet-button",
      ])),
    },
  };
};
