import {AnalyticEventName} from "../push/types";

export const Templates: { [k in AnalyticEventName]?: string } = {
  COMMENT_PROPOSAL: "comment.hbs",
  COMMENT_DELIVERABLE: "comment.hbs",
}