import { api } from "services/api";

export async function useSubscribeToTask(taskId: number) {
  return api.put(`/task/${taskId}/subscribe`);
}
