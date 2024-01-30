import { useRouter } from "next/router";

import TaskListItemDefault
  from "components/lists/tasks/tasks-list-item/task-list-item-default/task-list-item-default.view";
import TaskListItemManagement
  from "components/lists/tasks/tasks-list-item/task-list-item-management/task-list-item-management.controller";
import TaskListItemSmall from "components/lists/tasks/tasks-list-item/task-list-item-small/task-list-small.view";
import TasksListItemTaskHall
  from "components/lists/tasks/tasks-list-item/tasks-list-item-task-hall/tasks-list-item-task-hall.view";

import { IssueBigNumberData } from "interfaces/issue-data";

import useMarketplace from "x-hooks/use-marketplace";

interface TasksListItemProps {
  issue?: IssueBigNumberData;
  xClick?: () => void;
  size?: "sm" | "lg";
  variant?: "network" | "multi-network" | "management";
}

export default function TasksListItem({
  size = "lg",
  issue = null,
  xClick,
  variant = "network"
}: TasksListItemProps) {
  const router = useRouter();

  const { getURLWithNetwork } = useMarketplace();

  function handleClickCard() {
    if (xClick) return xClick();
    router.push(getURLWithNetwork("/task/[id]", {
      id: issue?.id,
      network: issue?.network?.name
    }));
  }

  if (size === "sm") {
    return (
      <TaskListItemSmall
        task={issue}
        onClick={handleClickCard}
      />
    );
  }

  if (variant === "management") {
    return (
      <TaskListItemManagement
        task={issue}
        onClick={handleClickCard}
      />
    );
  }

  if (variant === "multi-network")
    return (
      <TasksListItemTaskHall
        task={issue}
        onClick={handleClickCard}
      />
    );

  return (
    <TaskListItemDefault
      task={issue}
      onClick={handleClickCard}
    />
  );
}