import TasksList from "components/lists/tasks/controller";
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
      <TasksList
        bounties={bounties}
        variant="profile"
      />
    </ProfileLayout>
  );
}
