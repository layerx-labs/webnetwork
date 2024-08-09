import { IssueData } from "interfaces/issue-data";

import { api } from "services/api";

interface CreatePreBounty {
  title: string;
  body: string;
  creator: string;
  deliverableType: string;
  origin?: string;
  tags: string[];
  isKyc?: boolean;
  tierList?: number[];
  amount: string;
  networkName: string;
  privateDeliverables?: boolean;
  multipleWinners?: boolean;
}

export function useCreatePreBounty(payload: CreatePreBounty): Promise<IssueData> {
  return api
    .post<IssueData>("/task", payload)
    .then(({ data }) => data)
    .catch(error => {
      console.debug("Failed to create pre task", error);
      return null;
    });
}