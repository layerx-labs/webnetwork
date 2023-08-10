import { useTranslation } from "next-i18next";

import {
  formatDate,
  getDifferenceBetweenDates,
  getTimeDifferenceInWords,
} from "helpers/formatDate";
import { truncateAddress } from "helpers/truncate-address";

import { User } from "interfaces/api";

import AvatarOrIdenticon from "../../../avatar-or-identicon";
import MarkedRender from "../../../MarkedRender";

export interface CommentsProps {
  id: number;
  comment: string;
  hidden: boolean;
  type: string;
  issueId: number;
  proposalId?: number;
  deliberableId?: number;
  userId: number;
  userAddress: string;
  replyId?: number;
  updatedAt: Date;
  createdAt: Date;
  user: User;
}

export default function Comment({
  comment,
  userAddress,
  user,
  updatedAt,
  hidden,
}: CommentsProps) {
  const { t } = useTranslation("bounty");

  if (hidden) return;

  return (
    <div className="border-radius-8 p-3 bg-gray-800 mb-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center">
          <AvatarOrIdenticon
            user={user?.githubLogin}
            address={userAddress}
            size="xsm"
          />
          <span className="xs-medium ms-2">
            {user?.githubLogin
              ? `@${user?.githubLogin}`
              : truncateAddress(userAddress)}{" "}
          </span>
          <span className="p-small text-gray-500 ms-2">
            {updatedAt && getTimeDifferenceInWords(updatedAt, new Date())}
          </span>
        </div>
        <div className="d-flex align-items-center">
          <span className="mx-2">. . .</span>
        </div>
      </div>

      <MarkedRender
        className="p-small mb-0 comment"
        source={comment || t("no-comments-available")}
      />
    </div>
  );
}
