import { GetServerSideProps } from "next";

import LeaderBoardPage from "components/pages/leaderboard/view";

import { emptyPaginatedData } from "helpers/api";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { getLeaderboardData } from "x-hooks/api/leaderboard";

export default LeaderBoardPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const leaderboard = await getLeaderboardData(query)
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData);
  
  return {
    props: {
      leaderboard,
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "council",
        "connect-wallet-button",
        "custom-network",
        "leaderboard",
      ])),
    },
  };
};
