import ListIssues from "components/list-issues";
import ProfileLayout from "components/profile/profile-layout";

import { SearchBountiesPaginated } from "types/api";

interface BountiesPageProps {
  bounties: SearchBountiesPaginated;
}

export default function BountiesPage({
  bounties
}: BountiesPageProps) {
  return(
    <ProfileLayout>
      <ListIssues 
        bounties={bounties}
        variant="profile"
      />
    </ProfileLayout>
  );
}
