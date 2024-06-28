import { useTranslation } from "next-i18next";

import BountyDescription from "components/bounty/description/controller";
import BountyEditTag from "components/bounty/edit-tag/controller";
import BountyStatusProgress from "components/bounty/status-progress/controller";
import If from "components/If";

import { IssueBigNumberData } from "interfaces/issue-data";

import BodyEditButtons from "./edit-buttons/view";
interface BountyBodyProps {
  isEditIssue: boolean;
  isSubmitting: boolean;
  body: string;
  handleBody: (v: string) => void;
  selectedTags: string[];
  handleSelectedTags: (v: string[]) => void;
  handleCancelEdit: () => void;
  handleUpdateBounty: () => void;
  isDisableUpdateIssue: () => boolean;
  walletAddress?: string;
  bounty: IssueBigNumberData;
}

export default function BountyBodyView({
  isEditIssue,
  isSubmitting,
  body,
  handleBody,
  selectedTags,
  handleSelectedTags,
  handleCancelEdit,
  handleUpdateBounty,
  isDisableUpdateIssue,
  walletAddress,
  bounty,
}: BountyBodyProps) {
  const { t } = useTranslation(["common", "bounty"]);

  return (
    <div className="mb-1">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="border-radius-8 p-3 bg-gray-850 mb-3">
            <If condition={isEditIssue}>
              <div className="d-flex justify-content-center">
                <span className="p family-Regular font-weight-medium mt-1 text-info">
                  {t("bounty:edit-text")}
                </span>
              </div>
            </If>
            <BountyEditTag
              isEdit={isEditIssue}
              selectedTags={selectedTags}
              setSelectedTags={handleSelectedTags}
            />
            <>
              <BountyDescription
                body={body}
                setBody={handleBody}
                isEdit={isEditIssue}
              />
            </>
            <If condition={!!walletAddress}>
              <If condition={isEditIssue}>
                <BodyEditButtons
                  handleUpdateBounty={handleUpdateBounty}
                  handleCancelEdit={handleCancelEdit}
                  isDisableUpdateIssue={isDisableUpdateIssue()}
                />
              </If>
            </If>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <BountyStatusProgress currentBounty={bounty} />
        </div>
      </div>
    </div>
  );
}
