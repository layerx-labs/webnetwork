import { useTranslation } from "next-i18next";

import ExternalLinkIcon from "assets/icons/external-link-icon";

import Button from "../../button";
import Comment from "../../comment";

export default function BountyCommentsView({ comments = [], replyRef }) {
  const { t } = useTranslation("common");

  return (
    <div className="mb-5">
      <div className="row justify-content-center">
        <div className="col">
          <div className="content-wrapper bg-gray-850">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="caption-medium mb-0">
                {t("misc.comments", { count: 0 })}
              </h5>
            </div>
            {!!comments.length && comments?.map((comment) => (
              <Comment comment={comment} key={comment?.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}