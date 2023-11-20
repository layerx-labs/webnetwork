import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next/types";

import NetworkCurators from "components/pages/network-curators/controller";

import { emptyBountiesPaginated } from "helpers/api";

import getNetworkOverviewData from "x-hooks/api/get-overview-data";
import useGetCuratorOverview from "x-hooks/api/overview/use-get-overview-curator";
import { getBountiesListData } from "x-hooks/api/task";

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

  const [bounties, curators, overview] = await Promise.all([
    state ? getBountiesList({ ...query, state }) : emptyBountiesPaginated,
    useGetCuratorOverview({ ...query, chain: query?.networkChain }),
    getNetworkOverviewData(query)
  ]);
    
  return {
    props: {
      bounties,
      totalReadyBounties: overview?.bounties?.ready || 0,
      totalDistributed: overview?.networkTokenOnClosedBounties || 0,
      totalLocked: overview?.curators?.tokensLocked || 0,
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
