import { ChangeEvent, useState } from "react";

import InputCommentView from "./view";

export default function InputComment({
  githubLogin,
  userAddress,
}: {
  githubLogin?: string;
  userAddress: string;
}) {
  const [comment, setComment] = useState<string>();

  function handleChangeComment(e: ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value)
  }

  function handleSubmitComment() {
    console.log('commment', comment)
    //comment.post(comment)
    //updateData()
  }

  return (
    <InputCommentView
      githubLogin={githubLogin}
      userAddress={userAddress}
      comment={comment}
      handleChangeComment={handleChangeComment}
      handleSubmitComment={handleSubmitComment}
    />
  );
}
