import { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import Button from "components/button";
import { FormGroup } from "components/form-group";
import Modal from "components/modal";

import { MetamaskErrors } from "interfaces/enums/Errors";

import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useBepro from "x-hooks/use-bepro";

export function DeployBountyTokenModal({
  show = false,
  handleHide,
  onChange
}) {
  const { t } = useTranslation(["setup", "common"]);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const { addError, addSuccess } = useToastStore();
  const { handleDeployBountyToken } = useBepro();

  const deployBtnDisabled = name.trim() === "" || symbol.trim() === "";

  function handleClose() {
    setName("");
    setSymbol("");
    handleHide();
  }

  async function deployContract() {    
    try {
      setIsExecuting(true);

      const tx = await handleDeployBountyToken(name, symbol);

      onChange(tx.contractAddress, true);
      handleClose();
      addSuccess(t("common:actions.success"), t("registry.modals.deploy-bounty-token.success.deploy"));
    } catch (error) {
      if (error?.code !== MetamaskErrors.UserRejected)
        addError(t("common:actions.failed"), t("registry.modals.deploy-bounty-token.errors.deploy"));
    } finally {
      setIsExecuting(false);
    }
  }

  return(
    <Modal
      show={show}
      onCloseClick={handleClose}
      title={t("registry.modals.deploy-bounty-token.title")}
    >
      <Row className="mb-3">
        <FormGroup
          label={t("registry.modals.deploy-bounty-token.fields.name.label")}
          placeholder={t("registry.modals.deploy-bounty-token.fields.name.placeholder")}
          value={name}
          onChange={setName}
        />

        <FormGroup
          label={t("registry.modals.deploy-bounty-token.fields.symbol.label")}
          placeholder={t("registry.modals.deploy-bounty-token.fields.symbol.placeholder")}
          value={symbol}
          onChange={setSymbol}
        />
      </Row>

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button
            onClick={deployContract}
            isLoading={isExecuting}
            withLockIcon={deployBtnDisabled}
            disabled={deployBtnDisabled || isExecuting}
            className={`border-radius-4 border border-${deployBtnDisabled || isExecuting ? "gray-700" : "primary"} 
                  sm-regular text-capitalize font-weight-medium py-2 px-3`}>
            <span>{t("registry.modals.deploy-bounty-token.actions.deploy")}</span>
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}