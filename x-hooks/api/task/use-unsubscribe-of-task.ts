import { api } from "services/api";

export async function useUnsubscribeToTask(taskId: number) {
  return api.put(`/task/${taskId}/unsubscribe`);
}
