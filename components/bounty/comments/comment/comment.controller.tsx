import { useState } from "react";

import { CommentView } from "components/bounty/comments/comment/comment.view";

import { TypeComment } from "interfaces/comments";
import { IssueDataComment } from "interfaces/issue-data";

interface CommentProps extends IssueDataComment {
  type: TypeComment;
}

export function Comment(comment: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);

  const onReplyButtonClick = () => setIsReplying(true);

  function hideReplyForm() {
    setIsReplying(false);
  }

  return(
    <CommentView
      comment={comment}
      type={comment?.type}
      isReplying={isReplying}
      onReplyButtonClick={onReplyButtonClick}
      hideReplyForm={hideReplyForm}
    />
  );
}
