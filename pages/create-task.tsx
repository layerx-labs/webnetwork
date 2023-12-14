import { GetServerSideProps } from "next";

import CreateTaskPage from "components/pages/task/create-task/controller";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { useSearchNetworks } from "x-hooks/api/marketplace/use-search-networks";

export default CreateTaskPage;

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
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
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "custom-network",
        "bounty",
        "connect-wallet-button",
      ])),
    },
  };
};
