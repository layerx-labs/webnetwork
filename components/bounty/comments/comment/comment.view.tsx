import { Collapse } from "react-bootstrap";

import { CommentBody } from "components/bounty/comments/comment/comment-body/comment-body.view";
import { ReplyCommentForm } from "components/bounty/comments/comment/reply-comment-form/reply-comment-form.controller";

import { TypeComment } from "interfaces/comments";
import { IssueDataComment } from "interfaces/issue-data";

interface CommentViewProps {
  comment: IssueDataComment;
  type: TypeComment;
  isReplying: boolean;
  onReplyButtonClick: () => void;
  hideReplyForm: () => void;
}

export function CommentView({
  comment,
  type,
  isReplying,
  onReplyButtonClick,
  hideReplyForm,
}: CommentViewProps) {
  if (comment?.hidden) 
    return <></>;

  return (
    <div className="border-radius-8 bg-gray-800 mb-3">
      <CommentBody
        {...comment}
        isReplyButtonDisabled={isReplying}
        onReplyButtonClick={onReplyButtonClick}
      />

      {comment?.replies?.map(reply => (
        <CommentBody
          {...reply}
          key={reply?.id}
          variant="reply"
        />
      ))}
      
      <Collapse in={isReplying}>
        <div>
          <ReplyCommentForm
            commentId={comment?.id}
            taskId={comment?.issueId}
            deliverableId={comment?.deliverableId}
            proposalId={comment?.proposalId}
            type={type}
            onCancelClick={hideReplyForm}
            onSubmittedCallback={hideReplyForm}
          />
        </div>
      </Collapse>
    </div>
  );
}
