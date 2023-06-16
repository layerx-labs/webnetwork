import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next/types";

import NetworkCurators from "components/pages/network-curators/controller";

import { emptyBountiesPaginated, emptyCuratorsPaginated } from "helpers/api";

import getBountiesListData from "x-hooks/api/get-bounties-list-data";
import getCuratorsListData from "x-hooks/api/get-curators-list-data";

export default NetworkCurators;

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { type } = query;

  const state = {
    "ready-to-propose": "proposable",
    "ready-to-dispute": "disputable",
    "ready-to-close": "mergeable",
  }[type?.toString()];

  const getBountiesList = (filters) => getBountiesListData(filters)
    .then(({ data }) => data)
    .catch(() => emptyBountiesPaginated);

  const [bounties, totalReadyBounties, curators] = await Promise.all([
    state ? getBountiesList({ ...query, state }) : emptyBountiesPaginated,
    getBountiesList({ state: "ready" }).then(({ count }) => count),
    getCuratorsListData(query)
      .then(({ data }) => data)
      .catch(() => emptyCuratorsPaginated)
  ]);
    
  return {
    props: {
      bounties,
      totalReadyBounties,
      curators,
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "council",
        "connect-wallet-button",
      ])),
    },
  };
};
