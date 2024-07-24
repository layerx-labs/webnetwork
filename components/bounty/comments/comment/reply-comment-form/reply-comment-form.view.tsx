import { ChangeEvent } from "react";

import { useTranslation } from "next-i18next";

import CloseIcon from "assets/icons/close-icon";
import SendIcon from "assets/icons/send-icon";

import { AvatarCurrentUser } from "components/avatar-current-user/avatar-current-user.controller";
import Button from "components/button";

interface ReplyCommentFormViewProps {
  replyText: string;
  isSubmittingReply: boolean;
  onCancelButtonClick: () => void;
  onSubmitReplyClick: () => void;
  onReplyInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ReplyCommentFormView({
  replyText,
  isSubmittingReply,
  onCancelButtonClick,
  onSubmitReplyClick,
  onReplyInputChange,
}: ReplyCommentFormViewProps) {
  const { t } = useTranslation("bounty");

  return(
    <div className="d-flex align-items-center border-top border-gray-700 py-3 px-3 gap-2">
      <AvatarCurrentUser size="sm" />

      <input
        type="text" 
        placeholder={`${t("leave-a-reply")}...`}
        className="form-control bg-gray-800 text-white sm-regular border-0"
        onChange={onReplyInputChange}
        value={replyText}
      />

      <Button
        transparent
        onClick={onCancelButtonClick}
        disabled={isSubmittingReply}
        className="p-2 bg-gray-700 border-radius-8 text-gray-300 text-white-hover"
      >
        <CloseIcon />
      </Button>

      <Button
        color={replyText ? "primary" : "gray-750"}
        textClass={replyText ? "text-white" : "text-gray-300 text-white-hover"}
        disabled={!replyText || isSubmittingReply}
        onClick={onSubmitReplyClick}
        className={`p-2 border-radius-8`}
      >
        <SendIcon />
      </Button>
    </div>
  );
}