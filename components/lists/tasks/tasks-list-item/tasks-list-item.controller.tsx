import { useRouter } from "next/router";

import TaskListItemDefault
  from "components/lists/tasks/tasks-list-item/task-list-item-default/task-list-item-default.view";
import TaskListItemManagement
  from "components/lists/tasks/tasks-list-item/task-list-item-management/task-list-item-management.controller";
import TaskListItemSmall from "components/lists/tasks/tasks-list-item/task-list-item-small/task-list-small.view";
import TasksListItemTaskHall
  from "components/lists/tasks/tasks-list-item/tasks-list-item-task-hall/tasks-list-item-task-hall.view";

import { IssueBigNumberData } from "interfaces/issue-data";

import { TasksListItemVariant } from "types/components";

import useMarketplace from "x-hooks/use-marketplace";

interface TasksListItemProps {
  issue?: IssueBigNumberData;
  xClick?: () => void;
  variant?: TasksListItemVariant;
}

export default function TasksListItem({
  issue = null,
  xClick,
  variant = "network"
}: TasksListItemProps) {
  const router = useRouter();

  const { getURLWithNetwork } = useMarketplace();

  const itemComponent = {
    small: TaskListItemSmall,
    network: TaskListItemDefault,
    "multi-network": TasksListItemTaskHall,
    management: TaskListItemManagement
  }[variant] || TaskListItemDefault;

  function handleClickCard() {
    if (xClick) return xClick();
    router.push(getURLWithNetwork("/task/[id]", {
      id: issue?.id,
      network: issue?.network?.name
    }));
  }

  return itemComponent({
      task: issue,
      onClick: handleClickCard
  });
}