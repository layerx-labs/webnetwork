import {OverlayTrigger, Tooltip} from "react-bootstrap";

import {useTranslation} from "next-i18next";

import Avatar from "components/avatar";
import AvatarOrIdenticon from "components/avatar-or-identicon";
import BountyItemLabel from "components/bounty-item-label";
import BountyStatusInfo from "components/bounty-status-info";
import PriceConversor from "components/bounty/bounty-hero/price-conversor/controller";
import Button from "components/button";
import ChainIcon from "components/chain-icon";
import CustomContainer from "components/custom-container";
import If from "components/If";
import OriginLinkWarningModal from "components/modals/origin-link-warning/view";

import {truncateAddress} from "helpers/truncate-address";

import {IssueBigNumberData, IssueState} from "interfaces/issue-data";

import BountyTagsView from "../bounty-tags/view";
import TaskTypeBadge from "../task-type-badge/task-type-badge.view";
import BountySettings from "./bounty-settings/controller";

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
  hideOriginModal
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
    <div className="mt-2 border-bottom border-gray-850 pb">
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

              <div className="col-auto">
                <BountySettings
                  currentBounty={bounty}
                  updateBountyData={updateBountyData}
                  isEditIssue={isEditIssue}
                />
              </div>
            </div>

            <div 
              className="row align-items-center flex-wrap border-top border-gray-850 mt-3 pt-3"
            >
              <div className="col-auto">
                <div className="row py-1 mx-0 bg-transparent border border-gray-700 text-gray-300 border-radius-4">
                  <div className="d-flex align-items-center">
                    <BountyStatusInfo
                      issueState={currentState}
                      fundedAmount={bounty?.fundedAmount}
                    />
                    <span className="ms-1 text-white text-capitalize">
                      {currentState}
                    </span>
                  </div>
                </div>
              </div>

              <If condition={bounty?.isKyc}>
                <div className="col-auto">
                  <OverlayTrigger
                    key="bottom-githubPath"
                    placement="bottom"
                    overlay={
                      <Tooltip id={"tooltip-bottom"}>
                        {t("bounty:kyc.bounty-tool-tip")}
                      </Tooltip>
                    }
                  >
                    <div
                      className={`ms-3 d-flex py-1 px-2 bg-transparent border 
                                  border-gray-700 text-white border-radius-4`}
                    >
                      {t("bounty:kyc.label")}
                    </div>
                  </OverlayTrigger>
                </div>
              </If>

              <div className="col">
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <ChainIcon
                      src={bounty?.network?.chain?.icon}
                      label={bounty?.network?.chain?.chainName}
                    />
                  </div>
                </div>
              </div>

              <div className="col-auto mt-2 mt-sm-0">
                {renderPriceConversor()}
              </div>
            </div>

            <h5 className="mt-3 break-title">
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
                  >
                    <span className="text-lowercase">
                      {bounty?.origin}
                    </span>
                  </Button>
                </BountyItemLabel>
              </If>

              <BountyItemLabel label={t("common:misc.type")} className="col-12 col-sm-auto">
                <span className={`text-truncate text-capitalize`}>
                  {bounty?.type}
                </span>
              </BountyItemLabel>

              <BountyItemLabel label={t("info.working")} className="col-12 col-sm-auto">
                <span className={`text-truncate`}>
                  {bounty?.working?.length}
                </span>
              </BountyItemLabel>

              <div className="d-flex align-items-center text-truncate">
                <BountyItemLabel label={t("common:misc.owner")} className="col-12 col-sm-auto gap-1">
                  <>
                    <div className="d-flex flex-column justify-content-center">
                      <AvatarOrIdenticon
                        size="xsm"
                        user={bounty?.user?.handle}
                        address={bounty?.user?.address}
                      />{" "}
                    </div>

                    <span className="text-truncate">
                      {bounty?.user?.handle || truncateAddress(bounty?.user?.address)}
                    </span>
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
