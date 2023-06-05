import React, { useState } from "react";
import { isMobile, isTablet } from "react-device-detect";

import { useTranslation } from "next-i18next";

import EditIcon from "assets/icons/transactions/edit";

import ConnectGithub from "components/connect-github";
import { ContextualSpan } from "components/contextual-span";
import CreatePullRequestModal from "components/create-pull-request-modal";
import If from "components/If";
import Modal from "components/modal";
import MultiActionButton, { Action } from "components/multi-action-button";
import ProposalModal from "components/proposal/create-proposal-modal";
import Translation from "components/translation";
import UpdateBountyAmountModal from "components/update-bounty-amount-modal";

import { BountyEffectsProvider } from "contexts/bounty-effects";

import { PageActionsViewProps } from "./page-actions";
import PageActionsButton from "./page-actions-button/view";

export default function PageActionsView({
  bounty,
  currentUser,
  handleEditIssue,
  handlePullrequest,
  handleStartWorking,
  isWalletConnected,
  isGithubConnected,
  isCreatePr,
  isCreateProposal,
  isExecuting,
  showPRModal,
  handleShowPRModal,
  ghVisibility,
  handleClickKyc,
  isUpdateAmountButton,
  isStartWorkingButton,
  isKycButton,
  isForkRepositoryLink,
  isEditButton,
}: PageActionsViewProps) {
  const { t } = useTranslation([
    "common",
    "pull-request",
    "bounty",
    "proposal",
  ]);

  const [showPRProposal, setShowPRProposal] = useState(false);
  const [showGHModal, setShowGHModal] = useState(false);
  const [showUpdateAmount, setShowUpdateAmount] = useState(false);

  function handleActionPr(arg: {
    title: string;
    description: string;
    branch: string;
  }): Promise<void> {
    if (!ghVisibility)
      return new Promise((resolve) => resolve(setShowGHModal(true)));

    return handlePullrequest(arg);
  }

  function handleActionWorking() {
    if (!ghVisibility) return setShowGHModal(true);
    handleStartWorking();
  }

  function ForkRepositoryLink() {
    return (
      <PageActionsButton
        forcePath={bounty?.repository?.githubPath}
        className="btn btn-primary bounty-outline-button"
      >
        <Translation label="actions.fork-repository" />
      </PageActionsButton>
    );
  }

  function KycButton() {
    return (
      <PageActionsButton
        buttonType="normal"
        onClick={handleClickKyc}
        className="bounty-outline-button"
      >
        <Translation ns="bounty" label="kyc.identify-to-start" />
      </PageActionsButton>
    );
  }

  function StartWorkingButton() {
    return (
      <PageActionsButton
        onClick={handleActionWorking}
        className={`d-none d-lg-block read-only-button ${
          isTablet || isMobile ? "col-12" : "bounty-outline-button"
        }`}
        disabled={isExecuting}
        isLoading={isExecuting}
      >
        <span>
          <Translation ns="bounty" label="actions.start-working.title" />
        </span>
      </PageActionsButton>
    );
  }

  function CreatePullRequestButton() {
    return (
      <PageActionsButton
        onClick={() => handleShowPRModal(true)}
        className={"read-only-button bounty-outline-button"}
        disabled={!currentUser?.login || !isWalletConnected}
      >
        <span>
          <Translation ns="pull-request" label="actions.create.title" />
        </span>
      </PageActionsButton>
    );
  }

  function UpdateAmountButton() {
    return (
      <PageActionsButton
        className="read-only-button bounty-outline-button me-1"
        onClick={() => setShowUpdateAmount(true)}
      >
        <Translation ns="bounty" label="actions.update-amount" />
      </PageActionsButton>
    );
  }

  function CreateProposalButton() {
    return (
      <PageActionsButton
        className="read-only-button bounty-outline-button"
        onClick={() => handleShowPRModal(true)}
        disabled={!currentUser?.login || !isWalletConnected}
      >
        <Translation ns="proposal" label="actions.create.title" />
      </PageActionsButton>
    );
  }

  function EditButton() {
    return (
      <PageActionsButton
        className="read-only-button bounty-outline-button me-1"
        onClick={handleEditIssue}
      >
        <>
          <EditIcon className="me-1" />
          <Translation ns="bounty" label="actions.edit-bounty" />
        </>
      </PageActionsButton>
    );
  }

  function TabletAndMobileButton() {
    const actions: Action[] = [];

    if (isCreatePr)
      actions.push({
        label: "Pull Request",
        onClick: () => handleShowPRModal(true),
      });

    if (isCreateProposal)
      actions.push({
        label: "Proposal",
        onClick: () => setShowPRProposal(true),
      });

    if (!isGithubConnected && isWalletConnected)
      return <ConnectGithub size="lg" />;

    if (isCreatePr || isCreateProposal)
      return (
        <MultiActionButton
          label="Create"
          className="col-12"
          actions={actions}
        />
      );
    
    if (isStartWorkingButton && isKycButton) return  <KycButton />

    return <StartWorkingButton />;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          {!isGithubConnected && isWalletConnected && (
            <ContextualSpan context="info" className="mb-2" isAlert>
              {t("actions.connect-github-to-work")}
            </ContextualSpan>
          )}

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="h4 d-flex align-items-center d-none d-lg-block">
              {t("misc.details")}
            </h4>
            <div className="d-none d-lg-block">
              <div className="d-flex align-items-center gap-20">
                <If condition={isForkRepositoryLink}>
                  <ForkRepositoryLink />
                </If>
                <If condition={isStartWorkingButton && isKycButton}>
                  <KycButton />
                </If>
                <If condition={isStartWorkingButton && !isKycButton}>
                  <StartWorkingButton />
                </If>
                <If condition={isCreatePr}>
                  <CreatePullRequestButton />
                </If>
                <If condition={isUpdateAmountButton}>
                  <UpdateAmountButton />
                </If>
                <If condition={isCreateProposal}>
                  <CreateProposalButton />
                </If>
                <If condition={isEditButton}>
                  <EditButton />
                </If>
                <If condition={!isGithubConnected && isWalletConnected}>
                  <ConnectGithub size="sm" />
                </If>
              </div>
            </div>
            
            <div className="col-12 d-lg-none">
              <TabletAndMobileButton />
            </div>
          </div>
        </div>
      </div>

      <BountyEffectsProvider>
        <>
          <CreatePullRequestModal
            show={showPRModal}
            title={bounty?.title}
            description={bounty?.body}
            onConfirm={handleActionPr}
            repo={
              (currentUser?.login &&
                bounty?.repository?.githubPath &&
                bounty?.repository?.githubPath) ||
              ""
            }
            onCloseClick={() => handleShowPRModal(false)}
          />

          <UpdateBountyAmountModal
            show={showUpdateAmount}
            transactionalAddress={bounty?.transactionalToken?.address}
            bountyId={bounty?.contractId}
            handleClose={() => setShowUpdateAmount(false)}
          />

          <ProposalModal
            amountTotal={bounty?.amount}
            pullRequests={bounty?.pullRequests}
            show={showPRProposal}
            onCloseClick={() => setShowPRProposal(false)}
          />
        </>
      </BountyEffectsProvider>

      <Modal
        title={t("modals.gh-access.title")}
        centerTitle
        show={showGHModal}
        okLabel={t("actions.close")}
        onOkClick={() => setShowGHModal(false)}
      >
        <h5 className="text-center">
          <Translation ns="common" label="modals.gh-access.content" />
        </h5>
      </Modal>
    </div>
  );
}
