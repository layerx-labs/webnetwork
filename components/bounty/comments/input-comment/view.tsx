import {ChangeEvent} from "react";

import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";

import {truncateAddress} from "helpers/truncate-address";

export default function InputCommentView({
  handle,
  userAddress,
  comment,
  onCommentSubmit,
  onCommentChange ,
}: {
  handle?: string;
  userAddress: string;
  comment: string;
  onCommentSubmit: (...props) => void;
  onCommentChange : (e: ChangeEvent<HTMLTextAreaElement>) => void
}) {
  const { t } = useTranslation("common");

  return (
    <div className="border-radius-8 p-3 bg-gray-850 mb-3 border-gray-700 border">
      <div className="d-flex align-items-center mb-2">
        <div className="d-flex align-items-center text-truncate">
          <AvatarOrIdenticon
            user={handle}
            address={userAddress}
            size="xsm"
          />
          <span className="xs-medium ms-2 text-truncate">
            {handle ? `@${handle}` : truncateAddress(userAddress)}{" "}
          </span>
        </div>
      </div>
      <textarea
        tabIndex={0}
        className="ps-0 form-control input-comment"
        rows={2}
        data-test-id="comments-textarea"
        placeholder={t("comments.input.placeholder")}
        value={comment}
        onChange={onCommentChange}
      />

      <div className="d-flex justify-content-end mt-2">
      <Button
          className="btn-comment"
          data-test-id="comments-btn"
          onClick={onCommentSubmit}
          disabled={!comment?.length}
        >
          {t("comments.button")}
        </Button>
      </div>
    </div>
  );
}
