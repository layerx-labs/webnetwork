import { useTranslation } from "next-i18next";

import ReplyIcon from "assets/icons/reply-icon";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import CommentSettings from "components/bounty/comments/comment/settings/controller";
import Button from "components/button";
import { FlexColumn } from "components/common/flex-box/view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";
import If from "components/If";
import MarkedRender from "components/MarkedRender";

import { getTimeDifferenceInWords } from "helpers/formatDate";

import { IssueDataComment } from "interfaces/issue-data";

interface CommentBodyProps extends IssueDataComment {
  variant?: "comment" | "reply";
  isReplyButtonDisabled?: boolean;
  onReplyButtonClick?: () => void;
}

export function CommentBody({
  variant = "comment",
  user,
  userAddress,
  createdAt,
  comment,
  isReplyButtonDisabled,
  onReplyButtonClick,
}: CommentBodyProps) {
  const { t } = useTranslation("bounty");

  return(
    <div className={variant === "reply" ? "border-top border-gray-700" : ""}>
      <div className="d-flex align-items-baseline justify-content-between mb-2 flex-wrap-reverse pt-3 px-3">
        <div className="d-flex align-items-center flex-wrap w-100">
          <FlexColumn className="justify-content-center">
            <AvatarOrIdenticon
              user={user}
              size="sm"
            />
          </FlexColumn>

          <FlexColumn className="justify-content-center">
            <UserProfileLink
              className="xs-medium ms-2"
              address={userAddress}
              handle={user?.handle}
            />
          </FlexColumn>

          <FlexColumn className="align-items-baseline flex-grow-1">
            <span className="p-small text-gray-500 ms-2">
              {createdAt && getTimeDifferenceInWords(new Date(createdAt), new Date(), true) }
            </span>
          </FlexColumn>

          <If condition={variant === "comment"}>
            <FlexColumn className="align-items-baseline">
              <Button
                transparent
                onClick={onReplyButtonClick}
                disabled={isReplyButtonDisabled}
                className="p-2 border border-gray-700 border-radius-8 text-gray-300 text-white-hover"
              >
                <ReplyIcon />
              </Button>
            </FlexColumn>
          </If>
        </div>

        <CommentSettings
          isGovernor={false}
          hidden={false}
        />
      </div>
      
      <div className={`pb-3 px-3 ${variant === "reply" ? "ml-3" : ""}`}>
        <MarkedRender
          className="p-small mb-0 comment"
          source={comment || t("no-comments-available")}
        />
      </div>
    </div>
  );
}