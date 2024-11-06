import {ChangeEvent, useState} from "react";

import { AxiosError } from "axios";
import {useTranslation} from "next-i18next";

import InputCommentView from "components/bounty/comments/input-comment/view";

import { COMMENT_MAX_LENGTH } from "helpers/constants";
import {QueryKeys} from "helpers/query-keys";

import {IdsComment, TypeComment} from "interfaces/comments";

import {CreateComment} from "x-hooks/api/comments";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";
import { useTaskSubscription } from "x-hooks/use-task-subscription";

export default function InputComment({
  handle,
  userAddress,
  avatar,
  type,
  ids
}: {
  handle?: string;
  avatar?: string;
  userAddress: string;
  type: TypeComment;
  ids: IdsComment;
}) {
  const { t } = useTranslation(["common", "bounty"]);

  const [comment, setComment] = useState<string>();

  const queryKey = {
    issue: QueryKeys.bountyComments(ids?.issueId?.toString()),
    deliverable: QueryKeys.deliverable(ids?.deliverableId?.toString()),
    proposal: QueryKeys.proposalComments(ids?.proposalId?.toString())
  }[type];
  const commentLength = comment?.length || 0;
  const error = commentLength > COMMENT_MAX_LENGTH ? "max-length" : null;

  const { addError, addSuccess } = useToastStore();
  const { refresh: refreshSubscriptions } = useTaskSubscription();
  const { mutate: addComment } = useReactQueryMutation({
    queryKey: queryKey,
    mutationFn: () => CreateComment({
      comment,
      ...ids,
      type
    }),
    onSettled: (data, error: AxiosError<{ message: string }>) => {
      if (error) {
        addError(t("actions.failed"), `${error?.response?.data?.message}`);
        return;
      }
      addSuccess(t("actions.success"), t("bounty:actions.comment.success"));
      setComment("");
      refreshSubscriptions();
    }
  });

  function onCommentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value)
  }

  return (
    <InputCommentView
      handle={handle}
      userAddress={userAddress}
      avatarHash={avatar}
      comment={comment}
      commentLength={commentLength}
      maxLength={COMMENT_MAX_LENGTH}
      error={error}
      onCommentChange={onCommentChange}
      onCommentSubmit={addComment}
    />
  );
}
