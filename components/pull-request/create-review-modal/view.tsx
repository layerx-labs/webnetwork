import { ChangeEvent } from "react";

import { useTranslation } from "next-i18next";

import Avatar from "components/avatar";
import Button from "components/button";
import GithubInfo from "components/github-info";
import Modal from "components/modal";

import { formatDate } from "helpers/formatDate";

import { IssueBigNumberData, pullRequest } from "interfaces/issue-data";

import ContractButton from "../../contract-button";

interface CreateReviewModalViewProps {
  show: boolean;
  isExecuting: boolean;
  onCloseClick: () => void;
  pullRequest: pullRequest;
  currentBounty: IssueBigNumberData;
  githubPath: string;
  body: string;
  handleChangeBody: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isButtonDisabled: () => boolean;
  handleConfirm: () => void;
}

export default function CreateReviewModalView({
  show = false,
  isExecuting = false,
  onCloseClick,
  pullRequest,
  currentBounty,
  githubPath,
  body,
  handleChangeBody,
  isButtonDisabled,
  handleConfirm
}: CreateReviewModalViewProps) {
  const { t } = useTranslation(["common", "pull-request"]);

  return (
    <Modal
      size="lg"
      show={show}
      onCloseClick={onCloseClick}
      title={t("modals.create-review.title")}
      titlePosition="center">
      <div className="container">
        <div className="mb-2">
          <p className="caption-small trans mb-2">
            #{currentBounty?.githubId} {currentBounty?.title}
          </p>

          <p className="h4 mb-2">
            {t("pull-request:label")} #{pullRequest?.githubId}
          </p>

          <div className="d-flex align-items-center flex-wrap justify-content-center justify-content-md-start">
            <span className="caption-small text-gray mr-2">
              {t("misc.created-at")}{" "}
              {pullRequest && formatDate(pullRequest?.createdAt)}
            </span>

            <GithubInfo
              parent="modal"
              variant="repository"
              label={githubPath}
            />

            <span className="caption-small text-gray ml-2 mr-2">
              {t("misc.by")}
            </span>

            <GithubInfo
              parent="modal"
              variant="user"
              label={`@${pullRequest?.githubLogin}`}
            />

            <Avatar className="ml-2" userLogin={pullRequest?.githubLogin} />
          </div>
        </div>

        <div className="form-group">
          <label className="caption-small mb-2 text-gray">
            {t("modals.create-review.fields.review.label")}
          </label>
          
          <textarea
            value={body}
            rows={5}
            onChange={handleChangeBody}
            className="form-control"
            placeholder={t("modals.create-review.fields.review.placeholder")}
          />
        </div>

        <div className="d-flex pt-2 justify-content-between">
        <Button 
            color="dark-gray" 
            onClick={onCloseClick}
            disabled={isExecuting}
            withLockIcon={isExecuting}
          >
            {t("actions.cancel")}
          </Button>

          <ContractButton
            disabled={isButtonDisabled()}
            onClick={handleConfirm}
            isLoading={isExecuting}
            withLockIcon={isButtonDisabled() && !isExecuting}
          >
            <span>{t("modals.create-review.create-review")}</span>
          </ContractButton>
        </div>
      </div>
    </Modal>
  );
}
