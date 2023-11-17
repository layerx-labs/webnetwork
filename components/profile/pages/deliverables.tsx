import {useTranslation} from "next-i18next";
import { useRouter } from "next/router";

import BountiesList from "components/bounty/bounties-list/controller";
import ProfileLayout from "components/profile/profile-layout";

import { SearchBountiesPaginated } from "types/api";

import {useNetwork} from "x-hooks/use-network";

interface DeliverablesPageProps {
  bounties: SearchBountiesPaginated;
}

export default function DeliverablesPage({
  bounties
}: DeliverablesPageProps) {
  const {t} = useTranslation(["deliverable", "bounty"]);
  const { pathname } = useRouter();
  const { getURLWithNetwork } = useNetwork();

  const isOnNetwork = pathname?.includes("[network]");
  
  return(
    <ProfileLayout>
      <BountiesList
        bounties={bounties}
        redirect={isOnNetwork ? getURLWithNetwork("/tasks") : '/explore'}
        buttonMessage={t('bounty:label_other')}
        emptyMessage={String(t('errors.you-dont-have-deliverables'))}
        variant="profile"
        type="deliverables"
      />
    </ProfileLayout>
  );
}