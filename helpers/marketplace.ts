import { AllowListTypes } from "interfaces/enums/marketplace";

export function getAllowListColumnFromType (type: AllowListTypes) {
  const columns = {
    "open-task": "allow_list",
    "close-task": "close_task_allow_list"
  };
  return columns[type];
}