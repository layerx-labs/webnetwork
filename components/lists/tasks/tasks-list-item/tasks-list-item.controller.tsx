import React, { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import clsx from "clsx";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

import ArrowUpRightGray from "assets/icons/arrow-up-right-gray";
import EyeIcon from "assets/icons/eye-icon";
import EyeSlashIcon from "assets/icons/eye-slash-icon";
import TrashIcon from "assets/icons/trash-icon";

import Badge from "components/badge";
import BountyItemLabel from "components/bounty-item-label";
import BountyAmount from "components/bounty/amount-info/controller";
import BountyTagsView from "components/bounty/bounty-tags/view";
import TaskTypeBadge from "components/bounty/task-type-badge/task-type-badge.view";
import CardItem from "components/card-item";
import ChainIcon from "components/chain-icon";
import { FlexColumn } from "components/common/flex-box/view";
import If from "components/If";
import TasksListItemTaskHall
  from "components/lists/tasks/tasks-list-item/tasks-list-item-task-hall/tasks-list-item-task-hall.view";
import Modal from "components/modal";
import NetworkBadge from "components/network/badge/view";
import ResponsiveWrapper from "components/responsive-wrapper";
import TaskStatusInfo from "components/task-status-info";
import Translation from "components/translation";
import MoreActionsDropdown from "components/utils/more-actions-dropdown/controller";

import { formatNumberToCurrency } from "helpers/formatNumber";
import {getIssueState} from "helpers/handleTypeIssue";

import {IssueBigNumberData, IssueState} from "interfaces/issue-data";

import { useUpdateBountyVisibility } from "x-hooks/api/marketplace";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useBepro from "x-hooks/use-bepro";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";
import { useSettings } from "x-hooks/use-settings";

interface TasksListItemProps {
  issue?: IssueBigNumberData;
  xClick?: () => void;
  size?: "sm" | "lg";
  variant?: "network" | "multi-network" | "management";
}

export default function TasksListItem({
  size = "lg",
  issue = null,
  xClick,
  variant = "network"
}: TasksListItemProps) {
  const router = useRouter();
  const { t } = useTranslation(["bounty", "common", "custom-network"]);

  const [visible, setVisible] = useState<boolean>();
  const [isCancelable, setIsCancelable] = useState(false);
  const [hideTrashIcon, setHideTrashIcon] = useState<boolean>();
  const [showHardCancelModal, setShowHardCancelModal] = useState(false);
  const [isLoadingHardCancel, setIsLoadingHardCancel] = useState(false);

  const { settings } = useSettings();
  const { getURLWithNetwork } = useMarketplace();
  const { handleHardCancelBounty, getCancelableTime, getTimeChain } = useBepro();
  const { addError, addSuccess } = useToastStore();
  const { service: daoService } = useDaoStore();
  const { mutate: updateVisibility } = useReactQueryMutation({
    mutationFn: useUpdateBountyVisibility,
    toastSuccess: t("bounty:actions.update-bounty"),
    toastError: t("common:errors.failed-update-bounty"),
    onSuccess: () => {
      setVisible(!isVisible);
    }
  });

  const isVisible = visible !== undefined ? visible : issue?.visible;

  const issueState = getIssueState({
    state: issue?.state,
    amount: issue?.amount,
    fundingAmount: issue?.fundingAmount,
  });

  const fundedAmount = issue?.fundedAmount?.isNaN() ? BigNumber(0) : issue?.fundedAmount;

  const percentage =
    BigNumber(fundedAmount.multipliedBy(100).toFixed(2, 1))
      .dividedBy(issue?.fundingAmount)
      .toFixed(2, 1) || 0;

  function handleClickCard() {
    if (xClick) return xClick();
    router.push(getURLWithNetwork("/task/[id]", {
      id: issue?.id,
      network: issue?.network?.name
    }));
  }

  function handleUpdateVisibility() {
    updateVisibility({
      id: issue?.id,
      networkAddress: issue?.network?.networkAddress,
      visible: !isVisible
    });
  }

  function handleToastError(err?: string) {
    addError(t("common:actions.failed"), t("common:errors.failed-update-bounty"));
    console.debug(t("common:errors.failed-update-bounty"), err);
  }

  function handleHardCancel() {
    setIsLoadingHardCancel(true)
    handleHardCancelBounty(issue?.contractId, issue?.id)
      .then(() => {
        addSuccess(t("common:actions.success"), t("bounty:actions.canceled-bounty"));
        setShowHardCancelModal(false)
        setHideTrashIcon(true)
      }).catch(handleToastError)
      .finally(() => setIsLoadingHardCancel(false))
  }

  useEffect(() => {
    if (daoService && issue && variant === "management")
      Promise.all([
        getCancelableTime(),
        getTimeChain()
      ])
        .then(([cancelableTime, chainTime]) => {
          const canceable = +new Date(chainTime) >= +new Date(+issue?.contractCreationDate + cancelableTime);
          setIsCancelable(canceable);
        })
        .catch(error => console.debug("Failed to get cancelable time", error));
  }, [daoService, issue]);

  function IssueTag() {
    const tag = issue?.network?.name;
    const id = issue?.id;

    return (
      <span className={clsx([
        "caption-small font-weight-normal",
        isVisible && "text-gray-500" || "text-decoration-line text-gray-600",
      ])}>
        {tag ? `${tag}-${id}` : `#${id}`}
      </span>
    );
  }

  function RenderIssueData({ state }: {state: IssueState}) {
    const types = {
      funding: {
        value: percentage,
        translation: t("info.funded")
      },
      open: {
        value: issue?.working?.length,
        translation: t("info.working"),
      },
      ready: {
        value: issue?.deliverables?.length,
        translation: t("info.deliverables", {
          count: issue?.deliverables?.length,
        }),
      },
      proposal: {
        value: issue?.mergeProposals?.length,
        translation: t("info.proposals", {
          count: issue?.mergeProposals?.length,
        }),
      },
    };

    const lowerState = state?.toLowerCase();

    if (["open", "ready", "proposal", "funding"].includes(lowerState)) {
      const isFunding = lowerState === 'funding';
      const { value, translation } = types[lowerState];

      return (
        <BountyItemLabel label={translation} key={issue.id} className="col-auto">
          <span className={`${ isFunding ? 'text-light-warning': "text-gray"}`}>
            {value || 0}{isFunding && '%'}
          </span>
        </BountyItemLabel>
      );
    } else return <></>;
  }

  if (size === "sm") {
    const isSeekingFund = ["funding", "partial-funded"].includes(issueState);

    return (
      <CardItem onClick={handleClickCard} key="sm-card">
        <>
          <ResponsiveWrapper xs={false} md={true} className="d-flex gap-2 align-items-center justify-content-between">
            <div className="mw-50-auto network-name">
              <NetworkBadge
                logoUrl={issue?.network?.logoIcon && `${settings?.urls?.ipfs}/${issue?.network?.logoIcon}`}
                name={issue?.network?.name}
              />
            </div>

            <div className="max-width-content">
              <Badge
                color="transparent"
                className={`d-flex align-items-center gap-1 border border-gray-800 caption-medium 
                  font-weight-normal text-capitalize border-radius-8`}
              >
                <>
                  <TaskStatusInfo task={issue} />
                  <span>{isSeekingFund ? t("seeking-funding") : issueState}</span>
                </>
              </Badge>
            </div>
          </ResponsiveWrapper>

          <ResponsiveWrapper xs={true} md={false} className="align-items-center gap-2 mb-3">
            <TaskStatusInfo task={issue} />
            <span className="text-truncate text-capitalize">{issue?.title}</span>
          </ResponsiveWrapper>


          <ResponsiveWrapper xs={false} md={true} className="mt-3 flex-column">
            <span className="text-white text-truncate text-capitalize">
              {issue?.title}
            </span>

            <span className="text-gray-600 text-truncate text-capitalize">
              {issue?.body}
            </span>
          </ResponsiveWrapper>

          <div className="row align-items-center justify-content-md-end justify-content-between mt-2">
            <If condition={isSeekingFund}>
              <ResponsiveWrapper
                xs={false}
                md={true}
                className="col-6 caption-medium font-weight-normal text-capitalize"
              >
                <span className="mr-1">{t("info.funded")}</span>
                <span className="text-yellow-500">{formatNumberToCurrency(issue?.fundedPercent)}%</span>
              </ResponsiveWrapper>
            </If>

            <ResponsiveWrapper
              md={false}
              className="mw-50-auto network-name caption-medium font-weight-normal text-capitalize"
            >
              <NetworkBadge
                logoUrl={issue?.network?.logoIcon && `${settings?.urls?.ipfs}/${issue?.network?.logoIcon}`}
                name={issue?.network?.name}
              />
            </ResponsiveWrapper>

            <div className="col-6">
              <BountyAmount bounty={issue} size={size} />
            </div>
          </div>
        </>
      </CardItem>
    );
  }

  if (variant === "management") {
    return (
      <>
        <CardItem
          variant="management"
          hide={!isVisible}
          key="management"
        >
          <div className="row align-items-center">
            <div className="col col-md-6 text-overflow-ellipsis">
            <span className={`text-capitalize
              ${!isVisible && "text-decoration-line text-gray-600" || "text-gray-white"}`}>
              {(issue?.title !== null && issue?.title) || (
                <Translation ns="bounty" label={"errors.fetching"} />
              )}
            </span>
              <div className={!isVisible && 'text-decoration-line' || ""}>
                <IssueTag />
              </div>
            </div>

            <ResponsiveWrapper xs={false} md={true} className="col-2 d-flex justify-content-center">
              <FlexColumn className="justify-content-center">
                <div
                  className="cursor-pointer"
                  onClick={handleClickCard}
                >
                  <ArrowUpRightGray />
                </div>
              </FlexColumn>
            </ResponsiveWrapper>

            <ResponsiveWrapper xs={false} md={true} className="col-2 d-flex justify-content-center">
              <FlexColumn className="justify-content-center">
                <div className="cursor-pointer" onClick={handleUpdateVisibility}>
                  {isVisible ? <EyeIcon /> : <EyeSlashIcon />}
                </div>
              </FlexColumn>
            </ResponsiveWrapper>

            <ResponsiveWrapper xs={false} md={true} className="col-2 d-flex justify-content-center">
              <FlexColumn className="justify-content-center">
                {!hideTrashIcon && isCancelable && !['canceled', 'closed', 'proposal'].includes(issue?.state) ? (
                  <div className="cursor-pointer m-0 p-0" onClick={() => setShowHardCancelModal(true)}>
                    <TrashIcon />
                  </div>
                ): '-'}
              </FlexColumn>
            </ResponsiveWrapper>

            <ResponsiveWrapper xs={true} md={false} className="col-auto d-flex justify-content-center">
              <MoreActionsDropdown
                actions={[
                  { content: "Task Link", onClick: handleClickCard},
                  { content: isVisible ? "Hide Task" : "Show Task", onClick: handleUpdateVisibility},
                  { content: "Cancel", onClick: () => setShowHardCancelModal(true)},
                ]}
              />
            </ResponsiveWrapper>
          </div>
        </CardItem>
        <Modal
          title={t("common:modals.hard-cancel.title")}
          centerTitle
          show={showHardCancelModal}
          onCloseClick={() => setShowHardCancelModal(false)}
          cancelLabel={t("common:actions.close")}
          okLabel={t("common:actions.continue")}
          isExecuting={isLoadingHardCancel}
          okDisabled={isLoadingHardCancel}
          onOkClick={handleHardCancel}
        >
          <h5 className="text-center"><Translation ns="common" label="modals.hard-cancel.content"/></h5>
        </Modal>
      </>
    );
  }

  if (variant === "multi-network")
    return(
      <TasksListItemTaskHall
        task={issue}
        onClick={handleClickCard}
      />
    );

  return (
    <CardItem onClick={handleClickCard} key="default-card">
      <div className="row align-items-center">
        <div className="col">
          <div className="row align-items-center">
            <div className="col-auto">
              <TaskStatusInfo task={issue} />
            </div>

            <div className="col px-0 text-truncate">
              <span className="span">
                {(issue?.title !== null && issue?.title) || (
                  <Translation ns="bounty" label={"errors.fetching"} />
                )}
              </span>
            </div>

            <div className="col-auto">
              <ChainIcon
                src={issue?.network?.chain?.icon}
                label={issue?.network?.chain?.chainName}
              />
            </div>
          </div>

          <ResponsiveWrapper xs={false} xl={true}>
            <div className="d-flex justify-content-md-start mt-2 mb-3">
              <BountyTagsView tags={issue?.tags} />

              <If condition={issue?.isKyc}>
                <Badge
                  className={`d-flex status caption-medium py-1 px-3 
                  ms-2 bg-transparent border border-gray-700 text-gray-300`}
                  label={t("bounty:kyc.label")}
                />
              </If>
            </div>
          </ResponsiveWrapper>

          <div className="row align-items-center border-xl-top border-gray-850 pt-3">
            <div className="col-12">
              <ResponsiveWrapper xs={false} xl={true} className="row">
                <div className="col-12">
                  <div className="row align-items-center justify-content-md-start">
                    <BountyItemLabel label="ID" className="col-auto">
                      <IssueTag />
                    </BountyItemLabel>

                    <BountyItemLabel label="Type" className="col-auto">
                      <span className="text-gray text-truncate text-capitalize">
                        {issue?.type}
                      </span>
                    </BountyItemLabel>

                    <ResponsiveWrapper xs={false} xxl={true} className="col-auto">
                      <RenderIssueData state={issueState} />
                    </ResponsiveWrapper>

                    <BountyItemLabel
                      label={t("info.opened-on")}
                      className="col-auto"
                    >
                      <span className="text-gray text-truncate">
                        {issue?.createdAt?.toLocaleDateString("PT")}
                      </span>
                    </BountyItemLabel>

                    <div className="col d-flex justify-content-end px-0">
                      <TaskTypeBadge
                        type={issue?.type}
                      />
                    </div>

                    <div className="col-auto d-flex justify-content-end">
                      <BountyAmount bounty={issue} size={size} />
                    </div>
                  </div>
                </div>
              </ResponsiveWrapper>
              <ResponsiveWrapper
                xs={true}
                xl={false}
                className="row align-items-center justify-content-between"
              >
                <div className="col mw-50-auto network-name">
                  <TaskTypeBadge
                    type={issue?.type}
                  />
                </div>

                <div className="col-auto">
                  <BountyAmount bounty={issue} size={size} />
                </div>
              </ResponsiveWrapper>
            </div>
          </div>
        </div>
      </div>
    </CardItem>
  );
}