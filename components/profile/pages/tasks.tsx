import BountiesList from "components/bounty/bounties-list/controller";
import ProfileLayout from "components/profile/profile-layout";

import { SearchBountiesPaginated } from "types/api";

interface TasksPageProps {
  bounties: SearchBountiesPaginated;
}

export default function TasksPage({
  bounties
}: TasksPageProps) {
  return(
    <ProfileLayout>
      <BountiesList 
        bounties={bounties}
        variant="profile"
      />
    </ProfileLayout>
  );
}
