import {api} from "services/api";

import {UNSUBSCRIBE_EVENT} from "../../../helpers/constants";

export async function useUnsubscribeToTask(taskId: number) {
  return api.put(`/task/${taskId}/unsubscribe`)
    .finally(() => {
      window.dispatchEvent(UNSUBSCRIBE_EVENT);
    });
}
