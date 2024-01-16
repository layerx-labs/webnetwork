import {
    useEffect,
    useRef,
    useState,
  } from "react";
  
import { useTranslation } from "next-i18next";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import Modal from "components/modal";
import ResponsiveWrapper from "components/responsive-wrapper";
import Translation from "components/translation";

interface BountySettingsViewProps {
    isEditIssue?: boolean;
    handleHardCancel?: () => void;
    handleRedeem?: () => void;
    onEditIssue?: () => void;
    isGovernor: boolean;
    isWalletConnected: boolean;
    isBountyInDraft: boolean;
    isBountyOwner: boolean;
    isCancelable: boolean;
    isFundingRequest: boolean;
    isBountyFunded: boolean;
    isBountyOpen: boolean;
}
  
export default function BountySettingsView({
    handleHardCancel,
    handleRedeem,
    onEditIssue,
    isEditIssue,
    isGovernor,
    isWalletConnected,
    isBountyInDraft,
    isBountyOwner,
    isCancelable,
    isFundingRequest,
    isBountyFunded,
    isBountyOpen
  }: BountySettingsViewProps) {
  const { t } = useTranslation(["common", "deliverable", "bounty"]);
  const node = useRef();

  const [show, setShow] = useState(false);
  const [showHardCancelModal, setShowHardCancelModal] = useState(false);

  function handleHardCancelBounty() {
    setShowHardCancelModal(false)
    handleHardCancel()
  }

  function handleEditIssue() {
    onEditIssue()
    handleHide()
  }

  function handleHide() {
    setShow(false);
  }
  
  function handleClick(e) {
      // @ts-ignore
    if (node.current.contains(e.target)) return;
  
    handleHide();
  }
  
  function loadOutsideClick() {
    if (show) document.addEventListener("mousedown", handleClick);
    else document.removeEventListener("mousedown", handleClick);
  
    return () => document.removeEventListener("mousedown", handleClick);
  }

  function handleCancelClick(isHard) {
    return () => {
      if (isHard)
        setShowHardCancelModal(true)
      else
        handleRedeem();
      handleHide();
    }
  }
  
  function renderCancel() {
    const Cancel = (isHard: boolean) => (
        <ContractButton
          className="px-0 mx-0 p font-weight-normal text-capitalize"
          transparent
          align="left"
          onClick={handleCancelClick(isHard)}
          data-test-id="cancel-btn"
        >
          <Translation
            ns={isHard ? "common" : "bounty"}
            label={isHard ? "actions.cancel" : "actions.owner-cancel"}
          />
        </ContractButton>
      );

    if (isGovernor && isCancelable)
      return Cancel(true);
  
    const isDraftOrNotFunded = isFundingRequest
        ? !isBountyFunded
        : isBountyInDraft;
  
    if (
        isWalletConnected &&
        isBountyOpen &&
        isBountyOwner &&
        isDraftOrNotFunded &&
        !isEditIssue
      )
      return Cancel(false);
  }

  function renderEditButton() {
    if (isBountyOwner && isBountyInDraft)
      return (
        <ResponsiveWrapper xs={true} md={false}>
          <ContractButton
            className="px-0 mx-0 p font-weight-normal text-capitalize"
            transparent
            align="left"
            onClick={handleEditIssue}
            data-test-id="task-edit-btn"
          >
            <Translation ns="bounty" label="actions.edit-bounty" />
          </ContractButton>
        </ResponsiveWrapper>
      );
  }

  useEffect(loadOutsideClick, [show]);
  
  return (
      <>
        <div className="position-relative d-flex justify-content-end" ref={node}>
          <div
            className={`cursor-pointer hover-white border ${
              (show && "border-primary") || "border-gray-850"
            } border-radius-8 d-flex`}
            onClick={() => setShow(!show)}
            data-test-id="task-options"
          >
            <span className="mx-2 my-1">{t("common:misc.options")}</span>
          </div>
  
          <div
            className={`border border-gray-800 border-radius-4 filter-wrapper d-${
              show ? "flex" : "none"
            } justify-content-start align-items-stretch position-absolute`}
          >
            <div className="d-flex gap-2 flex-column bounty-settings p-2 bg-gray-950">
              {renderCancel()}
              {renderEditButton()}
            </div>
          </div>
        </div>

        <Modal
          title={t("modals.hard-cancel.title")}
          centerTitle
          show={showHardCancelModal}
          onCloseClick={() => setShowHardCancelModal(false)}
          cancelLabel={t("actions.close")}
          okLabel={t("actions.continue")}
          onOkClick={handleHardCancelBounty}
        >
          <h5 className="text-center">
            <Translation ns="common" label="modals.hard-cancel.content" />
          </h5>
        </Modal>
      </>
  );
}
  