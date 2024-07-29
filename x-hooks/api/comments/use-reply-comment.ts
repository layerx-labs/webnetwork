import { IssueDataComment } from "interfaces/issue-data";

import { api } from "services/api";

interface UseReplyCommentPayload {
  commentId: number;
  comment: string;
  issueId: number;
  deliverableId?: number;
  proposalId?: number;
  type: "deliverable" | "issue" | "proposal" | "review";
}

export async function useReplyComment({
  commentId: replyId,
  ...payload
}: UseReplyCommentPayload) {
  return api
    .post<IssueDataComment>("/comments", { replyId, ...payload });
}
