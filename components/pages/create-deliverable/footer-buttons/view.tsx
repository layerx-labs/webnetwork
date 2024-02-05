import {useTranslation} from "next-i18next";

import Button from "components/button";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import {ResponsiveEle} from "components/responsive-wrapper";

export default function FooterButtons({
  handleBack,
  handleCreate,
  disabledCreate,
  isLoadingCreate,
}: {
  handleBack: () => void;
  handleCreate: () => void;
  disabledCreate?: boolean;
  isLoadingCreate?: boolean;
}) {
  const { t } = useTranslation(["common", "deliverable"]);

  return (
    <>
      <div className="col-6 mx-0 pe-3">
        <Button className="col-12 bounty-outline-button" onClick={handleBack} data-testid="cancel-deliverable-btn">
          {t("actions.cancel")}
        </Button>
      </div>

      <div className="col-6 mx-0 ps-3">
        <ContractButton
          className="col-12 bounty-button"
          onClick={handleCreate}
          disabled={disabledCreate}
          isLoading={isLoadingCreate}
          data-testid="create-deliverable-btn"
        >
          <ResponsiveEle mobileView={t("common:misc.create")}
                         tabletView={t("deliverable:actions.create.title")} />
        </ContractButton>
      </div>
    </>
  );
}
