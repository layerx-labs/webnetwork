import {useTranslation} from "next-i18next";

import ListIssues from "components/list-issues";
import ProfileLayout from "components/profile/profile-layout";

import { SearchBountiesPaginated } from "types/api";

import {useNetwork} from "x-hooks/use-network";

interface PullRequestsPageProps {
  bounties: SearchBountiesPaginated;
}


export default function PullRequestsPage({
  bounties
}: PullRequestsPageProps) {
  const {t} = useTranslation(["pull-request", "bounty"]);

  const { getURLWithNetwork } = useNetwork();

  return(
    <ProfileLayout>
      <ListIssues
        bounties={bounties}
        redirect={getURLWithNetwork("/bounties")}
        buttonMessage={t('bounty:label_other')}
        emptyMessage={String(t('errors.you-dont-have-pull-requests'))}
        variant="profile"
        type="pull-requests"
      />
    </ProfileLayout>
  );
}