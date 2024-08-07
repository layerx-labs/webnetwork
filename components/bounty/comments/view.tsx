import {useTranslation} from "next-i18next";

import { Comment } from "components/bounty/comments/comment/comment.controller";
import InputComment from "components/bounty/comments/input-comment/controller";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";

import {CurrentUserState} from "interfaces/application-state";
import {IdsComment, TypeComment} from "interfaces/comments";
import {IssueDataComment} from "interfaces/issue-data";

export default function BountyCommentsView({
  comments = [],
  currentUser,
  type,
  ids,
  disableCreateComment,
}: {
  comments: IssueDataComment[];
  currentUser?: CurrentUserState;
  type: TypeComment;
  ids: IdsComment;
  disableCreateComment?: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <div className="mb-5">
      <div className="row justify-content-center">
        <div className="col">
          <div className="border-radius-8 p-3 bg-gray-900">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="caption-medium mb-0">{t("misc.comments")}</h5>
            </div>

            {!!comments?.length &&
              comments
                .filter(data => !data.replyId)
                .map((data) => <Comment {...data} type={type} key={data?.id} />)}

            {currentUser?.walletAddress ? (
              !disableCreateComment ? (
                <InputComment
                  userAddress={currentUser?.walletAddress}
                  handle={currentUser?.login}
                  avatar={currentUser?.avatar}
                  type={type}
                  ids={ids}
                />
              ) : null
            ) : (
              <div className="d-flex flex-column text-center mt-4 pt-2">
                <span>{t("comments.not-connect-wallet")}</span>
                <div className="d-flex justify-content-center mt-3 mb-1">
                  <ConnectWalletButton btnColor="primary" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
