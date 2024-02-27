import {useTranslation} from "next-i18next";

import Button from "components/button";
import {ResponsiveEle} from "components/responsive-wrapper";

export default function BodyEditButtons({
                                          handleCancelEdit,
                                          handleUpdateBounty,
                                          handleIsPreview,
                                          isPreview,
                                          isDisableUpdateIssue,
                                          isUploading,
                                        }: {
  handleUpdateBounty: () => void;
  handleCancelEdit: () => void;
  handleIsPreview: () => void;
  isPreview: boolean;
  isDisableUpdateIssue: boolean;
  isUploading: boolean;
}) {
  const {t} = useTranslation(["common", "bounty"]);

  function renderMobileButtons() {
    return <>
      <div className="col-12">
        <Button
          onClick={handleUpdateBounty}
          className="col-12"
          disabled={isDisableUpdateIssue}
          isLoading={isUploading}
          data-testid="edit-task-save-btn"
        >
          {t("bounty:save-changes")}
        </Button>
      </div>
      <div className="col-12 my-3">
        <Button
          outline={true}
          className="col-12"
          onClick={handleIsPreview}
          disabled={isUploading}
          data-testid="edit-task-preview-btn"
        >
          {!isPreview ? t("bounty:preview") : t("bounty:edit")}
        </Button>
      </div>
      <div className="col-12">
        <Button
          className="col-12"
          color="danger"
          onClick={handleCancelEdit}
          disabled={false}
          data-testid="edit-task-cancel-btn"
        >
          {t("bounty:cancel-changes")}
        </Button>
      </div>
    </>
  }

  function renderDesktopButtons() {
    return <>
      <Button color="danger" onClick={handleCancelEdit} disabled={false}>
        {t("bounty:cancel-changes")}
      </Button>
      <div className="d-flex">
        <Button
          outline={true}
          className="d-flex flex-shrink-0 w-40 btn-block"
          onClick={handleIsPreview}
          disabled={isUploading}
        >
          {!isPreview ? t("bounty:preview") : t("bounty:edit")}
        </Button>
        <Button
          className="d-flex flex-shrink-0 w-40 btn-block"
          onClick={handleUpdateBounty}
          disabled={isDisableUpdateIssue}
          isLoading={isUploading}
        >
          {t("bounty:save-changes")}
        </Button>
      </div>
    </>
  }

  return (
    <div className="row d-flex justify-content-center my-3">
      <ResponsiveEle mobileView={renderMobileButtons()} tabletView={renderDesktopButtons()}/>
    </div>
  );
}
