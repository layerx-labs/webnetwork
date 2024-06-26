import {useTranslation} from "next-i18next";
import { useRouter } from "next/router";

import TasksList from "components/lists/tasks/controller";
import DashboardLayout from "components/profile/dashboard-layout";

import { SearchBountiesPaginated } from "types/api";

import useMarketplace from "x-hooks/use-marketplace";

interface ProposalsPageProps {
  bounties: SearchBountiesPaginated;
}

export default function ProposalsPage({
  bounties
}: ProposalsPageProps) {
  const { t } = useTranslation(["proposal", "bounty"]);
  const { pathname } = useRouter();

  const { getURLWithNetwork } = useMarketplace();

  const isOnNetwork = pathname?.includes("[network]");

  return(
    <DashboardLayout>
      <TasksList
        bounties={bounties}
        redirect={isOnNetwork ? getURLWithNetwork("/tasks") : "/explore"}
        buttonMessage={t('bounty:label_other')}
        emptyMessage={t('errors.you-dont-have-proposals')}
        variant="profile"
        type="proposals"
      />
    </DashboardLayout>
  );
}
