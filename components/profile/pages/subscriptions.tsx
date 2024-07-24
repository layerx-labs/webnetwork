import {useSubscribedTasks} from "../../../x-hooks/use-subscribed-tasks";
import LoadingList from "../../bounties/loading-list";
import TasksList from "../../lists/tasks/controller";
import DashboardLayout from "../dashboard-layout";

export default function SubscriptionsPage() {
  const {loadingSubscriptions, subscriptions,} = useSubscribedTasks();

  return <DashboardLayout>
    <LoadingList loading={loadingSubscriptions} />
    <TasksList hideSearchFilter
               emptyMessage="No subscriptions found"
               bounties={{rows: subscriptions, count: subscriptions.length, pages: 1, currentPage: 1}}
               variant="profile"
               itemVariant="multi-network"
               countTitle="Subscriptions" />
  </DashboardLayout>
}