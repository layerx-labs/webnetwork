import React from "react";

import { useTranslation } from "next-i18next";

import ArrowUpRightGray from "assets/icons/arrow-up-right-gray";
import EyeIcon from "assets/icons/eye-icon";
import EyeSlashIcon from "assets/icons/eye-slash-icon";
import TrashIcon from "assets/icons/trash-icon";

import TaskIdTag from "components/bounty/task-id-tag/task-id-tag.view";
import CardItem from "components/card-item";
import { FlexColumn } from "components/common/flex-box/view";
import If from "components/If";
import Modal from "components/modal";
import ResponsiveWrapper from "components/responsive-wrapper";
import Translation from "components/translation";
import MoreActionsDropdown from "components/utils/more-actions-dropdown/controller";

import { IssueBigNumberData } from "interfaces/issue-data";

interface TaskListItemManagementViewProps {
  task: IssueBigNumberData;
  isVisible?: boolean;
  isCancelButtonVisible?: boolean;
  isCancelModalVisible?: boolean;
  isCancelling?: boolean;
  onClick?: () => void;
  onVisiblityClick: () => void;
  onCancelClick: () => void;
  onCloseModalClick: () => void;
  onCancelConfirm: () => void;
}

export default function TaskListItemManagementView ({
  task,
  isVisible,
  isCancelButtonVisible,
  isCancelModalVisible,
  isCancelling,
  onClick,
  onVisiblityClick,
  onCancelClick,
  onCloseModalClick,
  onCancelConfirm,
}: TaskListItemManagementViewProps) {
  const { t } = useTranslation(["bounty", "common", "custom-network"]);

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
                {(task?.title !== null && task?.title) || (
                  <Translation ns="bounty" label={"errors.fetching"} />
                )}
              </span>

            <div className={!isVisible && 'text-decoration-line' || ""}>
              <TaskIdTag
                taskId={task?.id}
                marketplaceName={task?.network?.name}
              />
            </div>
          </div>

          <ResponsiveWrapper xs={false} md={true} className="col-2 d-flex justify-content-center">
            <FlexColumn className="justify-content-center">
              <div
                className="cursor-pointer"
                onClick={onClick}
              >
                <ArrowUpRightGray />
              </div>
            </FlexColumn>
          </ResponsiveWrapper>

          <ResponsiveWrapper xs={false} md={true} className="col-2 d-flex justify-content-center">
            <FlexColumn className="justify-content-center">
              <div className="cursor-pointer" onClick={onVisiblityClick}>
                {isVisible ? <EyeIcon /> : <EyeSlashIcon />}
              </div>
            </FlexColumn>
          </ResponsiveWrapper>

          <ResponsiveWrapper xs={false} md={true} className="col-2 d-flex justify-content-center">
            <FlexColumn className="justify-content-center">
              <If
                condition={isCancelButtonVisible}
                otherwise={"-"}
              >
                <div className="cursor-pointer m-0 p-0" onClick={onCancelClick}>
                  <TrashIcon/>
                </div>
              </If>
            </FlexColumn>
          </ResponsiveWrapper>

          <ResponsiveWrapper xs={true} md={false} className="col-auto d-flex justify-content-center">
            <MoreActionsDropdown
              actions={[
                { content: "Task Link", onClick: onClick},
                { content: isVisible ? "Hide Task" : "Show Task", onClick: onVisiblityClick},
                { content: "Cancel", onClick: onCancelClick},
              ]}
            />
          </ResponsiveWrapper>
        </div>
      </CardItem>
      
      <Modal
        title={t("common:modals.hard-cancel.title")}
        centerTitle
        show={isCancelModalVisible}
        onCloseClick={onCloseModalClick}
        cancelLabel={t("common:actions.close")}
        okLabel={t("common:actions.continue")}
        isExecuting={isCancelling}
        okDisabled={isCancelling}
        onOkClick={onCancelConfirm}
      >
        <h5 className="text-center"><Translation ns="common" label="modals.hard-cancel.content"/></h5>
      </Modal>
    </>
  );
}