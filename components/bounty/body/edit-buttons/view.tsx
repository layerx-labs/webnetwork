import { useTranslation } from "next-i18next";

import Button from "components/button";
import ResponsiveWrapper from "components/responsive-wrapper";

export default function BodyEditButtons({
  handleCancelEdit,
  handleUpdateBounty,
  isDisableUpdateIssue,
}: {
  handleUpdateBounty: () => void;
  handleCancelEdit: () => void;
  isDisableUpdateIssue: boolean;
}) {
  const { t } = useTranslation(["common", "bounty"]);

  return (
    <>
      <ResponsiveWrapper
        md={false}
        xs={true}
        className="row d-flex justify-content-center my-3"
      >
        <div className="col-12">
          <Button
            onClick={handleUpdateBounty}
            className="col-12"
            disabled={isDisableUpdateIssue}
            data-testid="edit-task-save-btn"
          >
            {t("bounty:save-changes")}
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
      </ResponsiveWrapper>
      <ResponsiveWrapper
        md={true}
        xs={false}
        className="d-flex flex-row justify-content-between my-3"
      >
        <Button color="danger" onClick={handleCancelEdit} disabled={false}>
          {t("bounty:cancel-changes")}
        </Button>

        <Button
          className="d-flex flex-shrink-0 w-40 btn-block"
          onClick={handleUpdateBounty}
          disabled={isDisableUpdateIssue}
        >
          {t("bounty:save-changes")}
        </Button>
      </ResponsiveWrapper>
    </>
  );
}
