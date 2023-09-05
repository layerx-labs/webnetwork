import { useTranslation } from "next-i18next";

import Button from "components/button";
import ContractButton from "components/contract-button";
import ResponsiveWrapper from "components/responsive-wrapper";

export default function FooterButtons({
  handleBack,
  handleCreate,
}: {
  handleBack: () => void;
  handleCreate: () => void;
}) {
  const { t } = useTranslation(["common", "bounty"]);

  return (
    <>
      <div className="col-6 ps-2">
        <Button className="col-12 bounty-outline-button" onClick={handleBack}>
          {t("actions.back")}
        </Button>
      </div>

      <div className="col-6 pe-2">
        <ContractButton className="col-12 bounty-button" onClick={handleCreate}>
          <ResponsiveWrapper xs={true} md={false}>
            {t("common:misc.create")}
          </ResponsiveWrapper>
          <ResponsiveWrapper xs={false} md={true}>
            {t("bounty:create-bounty")}
          </ResponsiveWrapper>
        </ContractButton>
      </div>
    </>
  );
}
