import React, { useState} from "react";
import {Button} from "react-bootstrap";
import { isMobile, isTablet } from "react-device-detect";

import {useTranslation} from "next-i18next";

import EditIcon from "assets/icons/transactions/edit";

import ConnectGithub from "components/connect-github";
import {ContextualSpan} from "components/contextual-span";
import ContractButton from "components/contract-button";
import CreatePullRequestModal from "components/create-pull-request-modal";
import GithubLink from "components/github-link";
import Modal from "components/modal";
import MultiActionButton, { Action } from "components/multi-action-button";
import ProposalModal from "components/proposal/create-proposal-modal";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";
import Translation from "components/translation";
import UpdateBountyAmountModal from "components/update-bounty-amount-modal";

import {BountyEffectsProvider} from "contexts/bounty-effects";

import { PageActionsViewProps } from "./interfaces";

export default function PageActionsView({
    bounty,
    currentUser,
    isKycEnabled,
    isRepoForked,
    handleEditIssue,
    handlePullrequest,
    handleStartWorking,
    isEditIssue,
    isBountyInDraft,
    isWalletConnected,
    isKycVerified,
    isGithubConnected,
    isFundingRequest,
    isWorkingOnBounty,
    isBountyOpen,
    isStateToWorking,
    isBountyOwner,
    isCreatePr,
    isCreateProposal,
    isExecuting,
    showPRModal,
    handleShowPRModal,
    ghVisibility,
    handleClickKyc,
  }: PageActionsViewProps) {
  const {t} = useTranslation(["common", "pull-request", "bounty", "proposal"]);

  const [showPRProposal, setShowPRProposal] = useState(false);
  const [showGHModal, setShowGHModal] = useState(false);
  const [showUpdateAmount, setShowUpdateAmount] = useState(false);

  function handleActionPr(arg: { title:string , description:string , branch:string }): Promise<void> {
    if(!ghVisibility) return new Promise((resolve,) => resolve(setShowGHModal(true)))
      
    return handlePullrequest(arg)
  }

  function handleActionWorking() {
    if (!ghVisibility) return setShowGHModal(true)
    handleStartWorking()
  }


  function renderForkRepositoryLink() {
    if (isGithubConnected && !isBountyInDraft && isBountyOpen && !isRepoForked)
      return (
        <GithubLink
          forcePath={bounty?.repository?.githubPath}
          hrefPath="fork"
          className="btn btn-primary bounty-outline-button"
          >
          <Translation label="actions.fork-repository"/>
        </GithubLink>);
  }

  function renderStartWorkingButton() {
    if (isWalletConnected && 
        isGithubConnected &&
        !isBountyInDraft &&
        isBountyOpen &&
        !isWorkingOnBounty &&
        isRepoForked &&
        isStateToWorking &&
        currentUser?.accessToken
        ){

      if (isKycEnabled && bounty?.isKyc && !isKycVerified){
        return <>
          <Button onClick={handleClickKyc}>
            <Translation ns="bounty" label="kyc.identify-to-start" />
          </Button>
        </>
      }

      else{
        return (
            <ReadOnlyButtonWrapper>
              <ContractButton
                color="primary"
                onClick={handleActionWorking}
                className={`read-only-button ${isTablet || isMobile ? 'col-12' : 'bounty-outline-button'}`}
                disabled={isExecuting}
                isLoading={isExecuting}
              >
                <span>
                  <Translation ns="bounty" label="actions.start-working.title"/>
                </span>
              </ContractButton>
            </ReadOnlyButtonWrapper>
        );
      }
    }
  }

  function renderCreatePullRequestButton() {
    if (isCreatePr)
      return (
        <ReadOnlyButtonWrapper>
          <ContractButton
            className="read-only-button bounty-outline-button"
            onClick={() => handleShowPRModal(true)}
            disabled={!currentUser?.login || !isWalletConnected}
          >
            <Translation ns="pull-request" label="actions.create.title"/>
          </ContractButton>
        </ReadOnlyButtonWrapper>
      );
  }

  function renderUpdateAmountButton() {
    if (isWalletConnected && isBountyOpen && isBountyOwner && isBountyInDraft && !isFundingRequest && !isEditIssue)
      return (
        <ReadOnlyButtonWrapper>
          <ContractButton
            className="read-only-button bounty-outline-button me-1"
            onClick={() => setShowUpdateAmount(true)}
          >
            <Translation ns="bounty" label="actions.update-amount"/>
          </ContractButton>
        </ReadOnlyButtonWrapper>
      );
  }

  function renderCreateProposalButton() {
    if (isCreateProposal)
      return (
        <ReadOnlyButtonWrapper>
          <ContractButton
            className="read-only-button bounty-outline-button"
            onClick={() => handleShowPRModal(true)}
            disabled={!currentUser?.login || !isWalletConnected}
          >
            <Translation ns="proposal" label="actions.create.title"/>
          </ContractButton>
        </ReadOnlyButtonWrapper>
      );
  }

  function renderEditButton() {
    if (isWalletConnected && isBountyInDraft && isBountyOwner)
      return (
        <ReadOnlyButtonWrapper>
          <ContractButton
            className="read-only-button bounty-outline-button me-1"
            onClick={handleEditIssue}
          >
            <EditIcon className="me-1"/>
            <Translation ns="bounty" label="actions.edit-bounty" />
          </ContractButton>
        </ReadOnlyButtonWrapper>
      );
  }

  function renderTableAndMobileButton() {
    const actions: Action[] = []

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

    return renderStartWorkingButton();
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          {(!isGithubConnected && isWalletConnected) && 
          <ContextualSpan context="info" className="mb-2" isAlert>
            {t("actions.connect-github-to-work")}
          </ContextualSpan>}

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="h4 d-flex align-items-center d-none d-lg-block">
              {t("misc.details")}
            </h4>

            <div className="d-flex flex-row align-items-center gap-20 d-none d-lg-block">
              {renderForkRepositoryLink()}

              {renderStartWorkingButton()}

              {renderCreatePullRequestButton()}

              {renderUpdateAmountButton()}

              {renderCreateProposalButton()}

              {renderEditButton()}

              {!isGithubConnected && isWalletConnected && <ConnectGithub size="sm"/>}

            </div>
            <div className="col-12 d-lg-none"> 
              {renderTableAndMobileButton()}
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
                bounty?.repository?.githubPath) &&
              bounty?.repository?.githubPath ||
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
        <h5 className="text-center"><Translation ns="common" label="modals.gh-access.content"/></h5>
      </Modal>
    </div>
  );
}