import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import LeaderBoardList  from "components/leaderboard-list/controller";
import PageHero from "components/page-hero";

import { emptyPaginatedData } from "helpers/api";

import { LeaderBoardPageProps } from "types/pages";

import getLeaderboardData from "x-hooks/api/get-leaderboard-data";

export default function LeaderBoardPage({ leaderboard }: LeaderBoardPageProps) {
  const { t } = useTranslation(["common", "leaderboard"]);

  return (
    <>
      <PageHero
        title={t("leaderboard:title")}
        subtitle={t("leaderboard:sub-title")}
        infos={[]}
      />

      <LeaderBoardList
        leaderboard={leaderboard}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const leaderboard = await getLeaderboardData(query)
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData);
  
  return {
    props: {
      leaderboard,
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "connect-wallet-button",
        "custom-network",
        "leaderboard",
      ])),
    },
  };
};
