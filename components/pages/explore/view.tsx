import { useTranslation } from "next-i18next";

import GlobalHero from "components/common/global-hero/global-hero.view";
import CustomContainer from "components/custom-container";
import TasksList from "components/lists/tasks/controller";

import { formatNumberToNScale } from "helpers/formatNumber";

import { ExplorePageProps } from "types/pages";

interface ExplorePageViewProps extends ExplorePageProps {
  networkName?: string;
}

export default function ExplorePageView({
  totalOnTasks,
  bounties,
  protocolMembers
}: ExplorePageViewProps) {
  const { t } = useTranslation(["common", "custom-network", "bounty"]);

  const infos = [
    {
      value: bounties?.totalBounties || 0,
      label: t("heroes.open-tasks")
    },
    {
      value: `$${formatNumberToNScale(totalOnTasks || 0, 0)}`,
      label: t("heroes.to-grab")
    },
    {
      value: protocolMembers || 0,
      label: t("heroes.users")
    }
  ];

  return (
    <CustomContainer className="mt-3 px-xl-0">
      <GlobalHero
        infos={infos}
      />

      <TasksList
        bounties={bounties}
        variant="bounty-hall"
        filterType="category"
      />
    </CustomContainer>
  );
}