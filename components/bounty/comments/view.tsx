import { useTranslation } from "next-i18next";

import ConnectWalletButton from "components/connect-wallet-button";

import Comment, { CommentsProps } from "./comment/view";
import InputCommentView from "./input-comment/view";

export default function BountyCommentsView({ comments = [], userAddress }) {
  const { t } = useTranslation("common");
  const newComments: CommentsProps[] = [
    {
      id: 1,
      comment: "TESTING",
      hidden: false,
      type: "issue",
      issueId: 1,
      userId: 1,
      userAddress: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      updatedAt: new Date("2023-08-03 16:54:42.977 -0300"),
      createdAt: new Date("2023-08-03 16:54:42.977 -0300"),
      user: {
        id: 1,
        githubLogin: "MarcusviniciusLsantos",
        address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        createdAt: "2023-08-03 16:54:42.977 -0300",
        updatedAt: "2023-08-03 16:54:42.977 -0300",
        githubHandle: "Marcus Vinicius",
      },
    },
    {
      id: 2,
      comment: "TESTING 2",
      hidden: false,
      type: "issue",
      issueId: 1,
      userId: 1,
      userAddress: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      updatedAt: new Date("2023-08-03 16:54:42.977 -0300"),
      createdAt: new Date("2023-08-03 16:54:42.977 -0300"),
      user: {
        id: 1,
        githubLogin: "MarcusviniciusLsantos",
        address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        createdAt: "2023-08-03 16:54:42.977 -0300",
        updatedAt: "2023-08-03 16:54:42.977 -0300",
        githubHandle: "Marcus Vinicius",
      },
    },
  ];

  return (
    <div className="mb-5">
      <div className="row justify-content-center">
        <div className="col">
          <div className="border-radius-8 p-3 bg-gray-900">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="caption-medium mb-0">{t("misc.comments")}</h5>
            </div>
            {!!newComments.length &&
              newComments?.map((data) => <Comment {...data} key={data?.id} />)}
            {userAddress ? (
              <InputCommentView userAddress={userAddress} />
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