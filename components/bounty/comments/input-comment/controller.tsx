import {ChangeEvent, useState} from "react";

import {useTranslation} from "next-i18next";

import InputCommentView from "components/bounty/comments/input-comment/view";

import {QueryKeys} from "helpers/query-keys";

import {IdsComment, TypeComment} from "interfaces/comments";

import {CreateComment} from "x-hooks/api/comments";
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

  const { refresh: refreshSubscriptions } = useTaskSubscription();
  const { mutate: addComment } = useReactQueryMutation({
    queryKey: queryKey,
    mutationFn: () => CreateComment({
      comment,
      ...ids,
      type
    }),
    toastSuccess: t("bounty:actions.comment.success"),
    toastError: t("bounty:actions.comment.error"),
    onSuccess: () => {
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
      onCommentChange={onCommentChange}
      onCommentSubmit={addComment}
    />
  );
}
