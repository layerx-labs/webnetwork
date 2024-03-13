import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import CommentSettings from "components/bounty/comments/comment/settings/controller";
import {FlexColumn} from "components/common/flex-box/view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";
import MarkedRender from "components/MarkedRender";

import {getTimeDifferenceInWords,} from "helpers/formatDate";

import {IssueDataComment} from "interfaces/issue-data";

export default function Comment({
  comment,
  userAddress,
  user,
  updatedAt,
  hidden,
}: IssueDataComment) {
  const { t } = useTranslation("bounty");

  if (hidden) return;

  return (
    <div className="border-radius-8 p-3 bg-gray-800 mb-3">
      <div className="d-flex align-items-baseline justify-content-between mb-2 flex-wrap-reverse">
        <div className="d-flex align-items-baseline flex-wrap">
          <FlexColumn className="justify-content-center">
            <AvatarOrIdenticon
              user={user?.handle}
              address={userAddress}
              size="xsm"
            />
          </FlexColumn>
          <FlexColumn className="justify-content-center">
            <UserProfileLink
              className="xs-medium ms-2"
              address={userAddress}
              handle={user?.handle}
            />
          </FlexColumn>
          <FlexColumn className="align-items-baseline">
            <span className="p-small text-gray-500 ms-2">
              {updatedAt && getTimeDifferenceInWords(updatedAt, new Date(), true) }
            </span>
          </FlexColumn>
        </div>
        <CommentSettings
          handleHide={() => console.log}
          isGovernor={false}
          hidden={false} 
          updateBountyData={() => console.log}        
        />
      </div>

      <MarkedRender
        className="p-small mb-0 comment"
        source={comment || t("no-comments-available")}
      />
    </div>
  );
}
