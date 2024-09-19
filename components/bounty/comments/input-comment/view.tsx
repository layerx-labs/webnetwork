import {ChangeEvent} from "react";

import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import If from "components/If";

import {truncateAddress} from "helpers/truncate-address";

export default function InputCommentView({
  handle,
  userAddress,
  avatarHash,
  comment,
  commentLength,
  maxLength,
  error = null,
  onCommentSubmit,
  onCommentChange ,
}: {
  handle?: string;
  userAddress: string;
  avatarHash: string;
  comment: string;
  commentLength: number;
  maxLength: number;
  error: "max-length" | null;
  onCommentSubmit: (...props) => void;
  onCommentChange : (e: ChangeEvent<HTMLTextAreaElement>) => void
}) {
  const { t } = useTranslation("common");

  const borderColor = error ? "danger" : "gray-700";
  const errorMessage = {
    "max-length": t("errors.comment.max-length", { max: maxLength }),
  }[error];

  return (
    <>
      <div className={`border-radius-8 p-3 bg-gray-850 border border-${borderColor}`}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center text-truncate">
            <AvatarOrIdenticon
              user={{
                avatar: avatarHash,
                handle,
                address: userAddress,
              }}
              size="xsm"
            />
            <span className="xs-medium ms-2 text-truncate">
              {handle ? `@${handle}` : truncateAddress(userAddress)}{" "}
            </span>
          </div>

          <div className="xs-medium text-gray-300">
            {commentLength}/{maxLength}
          </div>
        </div>
        <textarea
          tabIndex={0}
          className="ps-0 form-control input-comment"
          rows={2}
          data-testid="comments-textarea"
          placeholder={t("comments.input.placeholder")}
          value={comment}
          onChange={onCommentChange}
        />

        <div className="d-flex justify-content-end mt-2">
        <Button
            className="btn-comment"
            data-testid="comments-btn"
            onClick={onCommentSubmit}
            disabled={!comment?.length || !!error}
          >
            {t("comments.button")}
          </Button>
        </div>
      </div>

      <If condition={!!error}>
        <small className="xs-small text-danger">{errorMessage}</small>
      </If>
    </>
  );
}
