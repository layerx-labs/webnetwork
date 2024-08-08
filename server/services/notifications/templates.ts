import {AnalyticEventName} from "../push/types";

export const Templates: { [k in AnalyticEventName]?: string } = {
  COMMENT_PROPOSAL: "comment.hbs",
  COMMENT_DELIVERABLE: "comment.hbs",
  REPLY_TO_THREAD_CREATOR: "reply-thread-creator.hbs",
  NOTIF_REPLY_TO_THREAD_CREATOR: "reply-thread-creator.hbs",
  REPLY_TO_THREAD_PARTICIPANT: "reply-thread-participant.hbs",
  NOTIF_REPLY_TO_THREAD_PARTICIPANT: "reply-thread-participant.hbs",
  SUBSCRIBER_COMMENT: "reply-thread-participant.hbs",
  NOTIF_SUBSCRIBER_COMMENT: "reply-thread-participant.hbs",
}