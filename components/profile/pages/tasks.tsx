import TasksList from "components/lists/tasks/controller";
import DashboardLayout from "components/profile/dashboard-layout";

import { SearchBountiesPaginated } from "types/api";

interface TasksPageProps {
  bounties: SearchBountiesPaginated;
}

export default function TasksPage({
  bounties
}: TasksPageProps) {
  return(
    <DashboardLayout>
      <TasksList
        bounties={bounties}
        variant="profile"
      />
    </DashboardLayout>
  );
}
