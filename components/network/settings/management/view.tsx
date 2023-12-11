import TasksList from "components/lists/tasks/controller";
import NetworkTabContainer from "components/network/settings/tab-container/view";

import { SearchBountiesPaginated } from "types/api";

interface NetworkManagementProps {
  bounties: SearchBountiesPaginated;
}

export default function NetworkManagement({
  bounties
}: NetworkManagementProps) {
  return(
    <NetworkTabContainer>
      <div className="mt-4">
        <TasksList bounties={bounties} variant="management" />
      </div>
    </NetworkTabContainer>
  );
}
