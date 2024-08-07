import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import BountyItemLabel from "components/bounty-item-label";
import BountySettings from "components/bounty/bounty-hero/bounty-settings/controller";
import PriceConversor from "components/bounty/bounty-hero/price-conversor/controller";
import BountyTagsView from "components/bounty/bounty-tags/view";
import TaskTypeBadge from "components/bounty/task-type-badge/task-type-badge.view";
import Button from "components/button";
import ChainIcon from "components/chain-icon";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";
import CustomContainer from "components/custom-container";
import If from "components/If";
import OriginLinkWarningModal from "components/modals/origin-link-warning/view";
import { SubscriptionTaskButton } 
  from "components/notifications/subscription-task-button/subscription-task-button.controller";
import TaskStatusInfo from "components/task-status-info";

import { IssueBigNumberData, IssueState } from "interfaces/issue-data";

interface BountyHeroProps {
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
  isOriginModalVisible: boolean;
  bounty: IssueBigNumberData;
  updateBountyData: (updatePrData?: boolean) => void;
  showOriginModal: () => void;
  hideOriginModal: () => void;
  network: string | string[];
  currentState: IssueState;
}

export default function BountyHeroView({
  isEditIssue,
  bounty,
  updateBountyData,
  network,
  currentState,
  isOriginModalVisible,
  showOriginModal,
  hideOriginModal,
  handleEditIssue
}: BountyHeroProps) {
  const { t } = useTranslation(["bounty", "common"]);

  function renderPriceConversor() {
    return (
      <PriceConversor
        token={bounty?.transactionalToken}
        currentValue={currentState === "funding" ? bounty?.amount : bounty?.developerAmount }
      />
    );
  }

  return (
    <div className="mt-3 border-bottom border-gray-850 pb">
      <CustomContainer>
        <div className="row d-flex flex-row justify-content-center">
          <div className="col-12 min-w-bounty-hero justify-content-center">
            <div className="row justify-content-between align-items-center">
              <div className="col">
                <span className="me-1 text-white-30 text-uppercase">
                  {network} /
                </span>
                <span className="text-break">
                  {bounty?.id}
                </span>
              </div>

              <div className="col-auto px-0 px-md-1">
                <SubscriptionTaskButton
                  taskId={+bounty?.id}
                />
              </div>

              <BountySettings
                currentBounty={bounty}
                updateBountyData={updateBountyData}
                isEditIssue={isEditIssue}
                onEditIssue={handleEditIssue}
              />
            </div>

            <div 
              className="row align-items-center flex-wrap border-top border-gray-850 mt-3 pt-3"
            >
              <div className="col-auto">
                <div className="row py-1 mx-0 bg-transparent border border-gray-700 text-gray-300 border-radius-4">
                  <Tooltip tip={t(`tips.status.${currentState}`)}>
                    <div className="d-flex align-items-center">
                      <TaskStatusInfo
                        task={bounty}
                      />
                      <span className="ms-1 text-white text-capitalize" data-testid="task-status">
                        {currentState}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>

              <If condition={bounty?.isKyc}>
                <div className="col-auto">
                  <Tooltip tip={t("bounty:kyc.bounty-tool-tip")}>
                    <div
                      className={`ms-3 d-flex py-1 px-2 bg-transparent border 
                                  border-gray-700 text-white border-radius-4`}
                    >
                      {t("bounty:kyc.label")}
                    </div>
                  </Tooltip>
                </div>
              </If>

              <div className="col">
                <div className="row justify-content-end">
                  <Tooltip tip={t("tips.chain")}>
                    <div className="col-auto">
                      <ChainIcon
                        src={bounty?.network?.chain?.icon}
                        label={bounty?.network?.chain?.chainName}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div className="col-auto mt-2 mt-sm-0">
                {renderPriceConversor()}
              </div>
            </div>

            <h5 className="mt-3 break-title" data-testid="task-title">
              {bounty?.title}
            </h5>

            <div className="d-flex flex-wrap gap-1 align-items-center mt-3 border-bottom border-gray-850 pb-4">
              <TaskTypeBadge
                type={bounty?.type}
                responsiveLabel={false}
              />
              <If condition={!!bounty?.tags?.length}>
                <BountyTagsView tags={bounty?.tags} />
              </If>
            </div>

            <div 
              className={`py-3 gap-3 d-flex flex-wrap align-items-center border-top 
                border-gray-850 justify-content-md-start`}
            >
              <If condition={!!bounty?.origin}>
                <BountyItemLabel label={t("common:misc.origin")} className="col-12 col-sm-3 text-overflow-ellipsis">
                  <Button
                    transparent
                    onClick={showOriginModal}
                    className="p-0 m-0 font-weight-medium text-decoration-underline"
                    textClass="text-primary"
                    data-testid="task-origin-btn"
                  >
                    <span className="text-lowercase" data-testid="task-origin">
                      {bounty?.origin}
                    </span>
                  </Button>
                </BountyItemLabel>
              </If>

              <BountyItemLabel label={t("common:misc.type")} className="col-12 col-sm-auto">
                <span className={`text-truncate text-capitalize`} data-testid="task-type">
                  {bounty?.type}
                </span>
              </BountyItemLabel>

              <BountyItemLabel
                label={t("info.working")}
                className="col-12 col-sm-auto"
                data-testid="task-users-working"
              >
                <span className={`text-truncate`}>
                  {bounty?.working?.length}
                </span>
              </BountyItemLabel>

              <div className="d-flex align-items-center text-truncate">
                <BountyItemLabel label={t("common:misc.owner")} className="col-12 col-sm-auto gap-1">
                  <>
                    <div className="d-flex flex-column justify-content-center me-1">
                      <AvatarOrIdenticon
                        size="xsm"
                        user={bounty?.user}
                      />{" "}
                    </div>

                    <UserProfileLink
                      className="text-truncate"
                      address={bounty?.user?.address}
                      handle={bounty?.user?.handle}
                    />
                  </>
                </BountyItemLabel>
              </div>

              <If condition={!!bounty?.createdAt}>
                <BountyItemLabel
                  label={t("common:misc.opened-on")}
                  className="col-12 col-sm-auto"
                >
                  <span className="text-truncate">
                    {bounty?.createdAt?.toLocaleDateString("PT")}
                  </span>
                </BountyItemLabel>
              </If>
            </div>
          </div>
        </div>
      </CustomContainer>

      <OriginLinkWarningModal
        show={isOriginModalVisible}
        originLink={bounty?.origin}
        onClose={hideOriginModal}
      />
    </div>
  );
}
