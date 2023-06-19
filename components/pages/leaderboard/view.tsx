import { useTranslation } from "next-i18next";

import PageHero from "components/common/page-hero/view";
import LeaderBoardList from "components/lists/leaderboard/controller";

import { LeaderBoardPageProps } from "types/pages";

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