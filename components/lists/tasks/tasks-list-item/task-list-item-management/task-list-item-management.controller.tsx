import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";

import TaskListItemManagementView
  from "components/lists/tasks/tasks-list-item/task-list-item-management/task-list-item-management.view";

import { TaskListItemVariantProps } from "types/components";

import { useUpdateBountyVisibility } from "x-hooks/api/marketplace";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useBepro from "x-hooks/use-bepro";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export default function TaskListItemManagement ({
  task,
  onClick,
}: TaskListItemVariantProps) {
  const { t } = useTranslation(["bounty", "common", "custom-network"]);
  
  const [visible, setVisible] = useState<boolean>();
  const [isCancelable, setIsCancelable] = useState(false);
  const [hideTrashIcon, setHideTrashIcon] = useState<boolean>();
  const [showHardCancelModal, setShowHardCancelModal] = useState(false);
  const [isLoadingHardCancel, setIsLoadingHardCancel] = useState(false);
  
  const { service: daoService } = useDaoStore();
  const { addError, addSuccess } = useToastStore();
  const { handleHardCancelBounty, getCancelableTime, getTimeChain } = useBepro();

  const { mutate: updateVisibility } = useReactQueryMutation({
    mutationFn: useUpdateBountyVisibility,
    toastSuccess: t("bounty:actions.update-bounty"),
    toastError: t("common:errors.failed-update-bounty"),
    onSuccess: () => {
      setVisible(!isVisible);
    }
  });

  const isVisible = visible !== undefined ? visible : task?.visible;
  const isCancelButtonVisible =
    !hideTrashIcon && isCancelable && !['canceled', 'closed', 'proposal'].includes(task?.state);

  const onCancelClick = () => setShowHardCancelModal(true);
  const onCloseModalClick = () => setShowHardCancelModal(false);

  function handleToastError(err?: string) {
    addError(t("common:actions.failed"), t("common:errors.failed-update-bounty"));
    console.debug(t("common:errors.failed-update-bounty"), err);
  }

  function handleUpdateVisibility() {
    updateVisibility({
      id: task?.id,
      networkAddress: task?.network?.networkAddress,
      visible: !isVisible
    });
  }

  function handleHardCancel() {
    setIsLoadingHardCancel(true);
    handleHardCancelBounty(task?.contractId, task?.id)
      .then(() => {
        addSuccess(t("common:actions.success"), t("bounty:actions.canceled-bounty"));
        setShowHardCancelModal(false);
        setHideTrashIcon(true);
      })
      .catch(handleToastError)
      .finally(() => setIsLoadingHardCancel(false));
  }

  useEffect(() => {
    if (daoService && task)
      Promise.all([
        getCancelableTime(),
        getTimeChain()
      ])
        .then(([cancelableTime, chainTime]) => {
          const canceable = +new Date(chainTime) >= +new Date(+task?.contractCreationDate + cancelableTime);
          setIsCancelable(canceable);
        })
        .catch(error => console.debug("Failed to get cancelable time", error));
  }, [daoService, task]);

  return (
    <TaskListItemManagementView
      task={task}
      isVisible={isVisible}
      isCancelButtonVisible={isCancelButtonVisible}
      isCancelModalVisible={showHardCancelModal}
      isCancelling={isLoadingHardCancel}
      onClick={onClick}
      onVisiblityClick={handleUpdateVisibility}
      onCancelClick={onCancelClick}
      onCloseModalClick={onCloseModalClick}
      onCancelConfirm={handleHardCancel}
    />
  );
}