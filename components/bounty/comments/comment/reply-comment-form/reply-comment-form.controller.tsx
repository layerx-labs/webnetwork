import { ChangeEvent, useState } from "react";

import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import { ReplyCommentFormView } from "components/bounty/comments/comment/reply-comment-form/reply-comment-form.view";

import { QueryKeys } from "helpers/query-keys";

import { TypeComment } from "interfaces/comments";

import { useReplyComment } from "x-hooks/api/comments/use-reply-comment";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";


interface ReplyCommentFormProps {
  commentId: number;
  taskId: number;
  deliverableId: number;
  proposalId: number;
  type: TypeComment;
  onCancelClick: () => void;
  onSubmittedCallback: () => void;
}

export function ReplyCommentForm({
  commentId,
  taskId,
  deliverableId,
  proposalId,
  type,
  onCancelClick,
  onSubmittedCallback,
}: ReplyCommentFormProps) {
  const { t } = useTranslation();

  const [replyText, setReplyText] = useState("");

  const { addError } = useToastStore();

  const queryKey = {
    issue: QueryKeys.bountyComments(taskId?.toString()),
    proposal: QueryKeys.proposalComments(proposalId?.toString()),
    deliverable: QueryKeys.deliverable(deliverableId?.toString())
  }[type];

  const { mutate: onSubmitReply, isPending: isSubmittingReply } = useReactQueryMutation({
    queryKey: queryKey,
    mutationFn: useReplyComment,
    onSuccess: () => {
      setReplyText("");
      onSubmittedCallback();
    },
    onError: (error: AxiosError<Error>) => addError(t("errors.failed-to-reply"), error.response.data.message),
  });

  function onSubmitReplyClick() {
    onSubmitReply({
      commentId: commentId,
      comment: replyText,
      issueId: taskId,
      deliverableId: deliverableId,
      proposalId: proposalId,
      type
    });
  }

  function onCancelButtonClick() {
    setReplyText("");
    onCancelClick();
  }

  const onReplyInputChange = (e: ChangeEvent<HTMLInputElement>) => setReplyText(e.target.value);

  return(
    <ReplyCommentFormView
      replyText={replyText}
      isSubmittingReply={isSubmittingReply}
      onCancelButtonClick={onCancelButtonClick}
      onSubmitReplyClick={onSubmitReplyClick}
      onReplyInputChange={onReplyInputChange}
    />
  );
}