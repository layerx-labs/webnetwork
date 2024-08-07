import {MouseEvent} from "react";

import {useTranslation} from "next-i18next";

import CreateBountyCard from "components/bounty/create-bounty/create-bounty-card";
import CreateBountyContainer from "components/bounty/create-bounty/create-bounty-container";
import CreateBountySteps from "components/bounty/create-bounty/create-bounty-steps";
import BountyDetailsSection from "components/bounty/create-bounty/sections/bounty-details/controller";
import CreateBountyReviewSection, {
  CreateBountyReviewSectionProps
} from "components/bounty/create-bounty/sections/review/view";
import RewardInformationSection from "components/bounty/create-bounty/sections/reward-information/controller";
import SelectNetworkSection, {
  SelectNetworkSectionProps
} from "components/bounty/create-bounty/sections/select-network/view";
import Button from "components/button";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import CustomContainer from "components/custom-container";
import If from "components/If";
import Modal from "components/modal";
import PrivateDeliverableBecomeCuratorModal 
  from "components/modals/private-deliverable-become-curator/private-deliverable-become-curator.controller";
import ResponsiveWrapper from "components/responsive-wrapper";
import {WarningSpan} from "components/warning-span";

import {TERMS_AND_CONDITIONS_LINK} from "helpers/constants";

import {BountyDetailsSectionProps} from "interfaces/create-bounty";

import {RewardInformationSectionProps} from "types/components";

interface CreateTaskPageViewProps 
  extends SelectNetworkSectionProps, 
          BountyDetailsSectionProps, 
          RewardInformationSectionProps,
          CreateBountyReviewSectionProps {
  isConnected: boolean;
  currentSection: number;
  isTokenApproved: boolean;
  isBackButtonDisabled: boolean;
  isApproveButtonDisabled: boolean;
  isApproving: boolean;
  isNextOrCreateButtonDisabled: boolean;
  isCreating: boolean;
  isBecomeCuratorModalVisible: boolean;
  creationSteps: string[];
  onBackClick: (e?: MouseEvent<HTMLButtonElement>) => void;
  onApproveClick: () => Promise<void>;
  onNextOrCreateButtonClick: () => Promise<void>;
  onSectionHeaderClick: (i: number) => void;
  allowCreateBounty?: boolean;
  showCannotCreateBountyModal?: boolean;
  privateDeliverable: boolean;
  closeCannotCreateBountyModal?(): void;
  handleCloseBecomeCuratorModal?(): void;
  onActionButtonClick(): void;
}

export default function CreateTaskPageView({
  isConnected,
  currentSection,
  isTokenApproved,
  isBackButtonDisabled,
  isApproveButtonDisabled,
  isApproving,
  isNextOrCreateButtonDisabled,
  isCreating,
  creationSteps,
  isBecomeCuratorModalVisible,
  onBackClick,
  onApproveClick,
  onNextOrCreateButtonClick,
  onSectionHeaderClick,
  handleCloseBecomeCuratorModal,
  onActionButtonClick,
  ...rest
}: CreateTaskPageViewProps) {
  const { t } = useTranslation(["common", "bounty"]);

  const isReviewSection = currentSection === 3;

  function section() {
    if (currentSection === 0)
      return (
        <SelectNetworkSection
          currentNetwork={rest.currentNetwork}
          currentChain={rest.currentChain}
          networksOfCurrentChain={rest.networksOfCurrentChain}
          onChainChange={rest.onChainChange}
          onNetworkChange={rest.onNetworkChange}
        />
      );

    if (currentSection === 1)
      return (
        <BountyDetailsSection
          title={rest.title}
          updateTitle={rest.updateTitle}
          description={rest.description}
          updateDescription={rest.updateDescription}
          selectedTags={rest.selectedTags}
          updateSelectedTags={rest.updateSelectedTags}
          isKyc={rest.isKyc}
          updateIsKyc={rest.updateIsKyc}
          updateTierList={rest.updateTierList}
          originLink={rest.originLink}
          originLinkError={rest.originLinkError}
          deliverableType={rest.deliverableType}
          onOriginLinkChange={rest.onOriginLinkChange}
          setDeliverableType={rest.setDeliverableType}
          privateDeliverable={rest.privateDeliverable}
          handlePrivateDeliverableChecked={rest.handlePrivateDeliverableChecked}
        />
      );

    if (currentSection === 2)
      return (
          <RewardInformationSection
            currentNetwork={rest.currentNetwork}
            isFundingType={rest.isFundingType} 
            rewardChecked={rest.rewardChecked} 
            transactionalToken={rest.transactionalToken} 
            rewardToken={rest.rewardToken} 
            bountyDecimals={rest.bountyDecimals} 
            rewardDecimals={rest.rewardDecimals} 
            issueAmount={rest.issueAmount} 
            rewardAmount={rest.rewardAmount} 
            bountyTokens={rest.bountyTokens} 
            rewardTokens={rest.rewardTokens} 
            rewardBalance={rest.rewardBalance} 
            bountyBalance={rest.bountyBalance}
            previewAmount={rest.previewAmount}
            distributions={rest.distributions}
            multipleWinners={rest.multipleWinners}
            onMultipleWinnersChange={rest.onMultipleWinnersChange}
            updateRewardToken={rest.updateRewardToken} 
            updateTransactionalToken={rest.updateTransactionalToken} 
            addToken={rest.addToken} 
            handleRewardChecked={rest.handleRewardChecked} 
            updateIssueAmount={rest.updateIssueAmount} 
            updateRewardAmount={rest.updateRewardAmount} 
            updateIsFundingType={rest.updateIsFundingType}    
            setPreviewAmount={rest.setPreviewAmount}  
            setDistributions={rest.setDistributions}   
            sethasAmountError={rest.sethasAmountError}
          />
      );

    if (currentSection === 3)
      return (
        <CreateBountyReviewSection
          payload={rest.payload}
        />
      );
  }

  function renderButtons() {
    return (
      <>
        <div className="col-6 ps-2">
          <Button
            className="col-12 bounty-outline-button"
            onClick={onBackClick}
            disabled={isBackButtonDisabled}
            data-testid="create-task-back-button"
          >
            {t("actions.back")}
          </Button>
        </div>

        <div className="col-6 pe-2">
          <If condition={!isTokenApproved && isReviewSection}>
            <ContractButton
              className="col-12 bounty-button"
              disabled={isApproveButtonDisabled}
              onClick={onApproveClick}
              isLoading={isApproving}
              data-testid="create-task-approve-button"
            >
              {t("actions.approve")}
            </ContractButton>
          </If>

          <If condition={!(!isTokenApproved && isReviewSection)}>
            <ContractButton
              className="col-12 bounty-button"
              disabled={isNextOrCreateButtonDisabled}
              isLoading={isCreating}
              onClick={onNextOrCreateButtonClick}
              data-testid={isReviewSection ? "create-task-button" : "create-task-next-button"}
            >
              <If 
                condition={isReviewSection}
                otherwise={t("bounty:next-step")}
              >
                <>
                  <ResponsiveWrapper xs={true} md={false}>
                    {t("common:misc.create")}
                  </ResponsiveWrapper>

                  <ResponsiveWrapper xs={false} md={true}>
                    {t("bounty:create-bounty")}
                  </ResponsiveWrapper>
                </>
              </If>
            </ContractButton>
          </If>

          <If condition={!rest.allowCreateBounty} >
            <WarningSpan text={t('bounty:allow-list.not-allowed')} />
          </If>
        </div>
      </>
    );
  }

  if (!isConnected)
    return <ConnectWalletButton asModal={true} />;

  return (
    <CreateBountyContainer>
      <CustomContainer col="col-xs-12 col-xl-10 px-0">
        <Modal show={rest.showCannotCreateBountyModal} onCloseClick={rest.closeCannotCreateBountyModal}
               title={t('bounty:modals.allow-list.title')}>
          <p className="text-center">{t('bounty:modals.allow-list.content')}</p>
        </Modal>
        <CreateBountySteps
          steps={creationSteps}
          currentSection={currentSection}
          updateCurrentSection={onSectionHeaderClick}
        />

        <CreateBountyCard
          maxSteps={creationSteps?.length}
          currentStep={currentSection + 1}
        >
          {section()}
        </CreateBountyCard>
      </CustomContainer>

      <If condition={isReviewSection}>
        <div className="mx-5">
          <div className="d-flex justify-content-center text-center col-12 mt-4">
            <p className="">
              {t("bounty:creating-this-bounty")}{" "}
              <a href={TERMS_AND_CONDITIONS_LINK} target="_blank">
                {t("bounty:terms-and-conditions")}
              </a>
            </p>
          </div>
        </div>
      </If>

      <PrivateDeliverableBecomeCuratorModal
        show={isBecomeCuratorModalVisible}
        marketplace={rest.currentNetwork}
        onClose={handleCloseBecomeCuratorModal}
        onActionButtonClick={onActionButtonClick}
      />

      <CustomContainer className='d-flex flex-column justify-content-end'>
        <ResponsiveWrapper className="row my-4" xs={false} md={true}>
          {renderButtons()}
        </ResponsiveWrapper>

        <ResponsiveWrapper className="row my-4 mx-1" xs={true} md={false}>
          {renderButtons()}
        </ResponsiveWrapper>
      </CustomContainer>
    </CreateBountyContainer>
  );
}