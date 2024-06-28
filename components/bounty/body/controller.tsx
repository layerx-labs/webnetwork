import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";

import { BODY_CHARACTERES_LIMIT } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";

import { IssueBigNumberData } from "interfaces/issue-data";

import { useEditBounty } from "x-hooks/api/task";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

import BountyBodyView from "./view";

interface BountyBodyControllerProps {
  isEditIssue: boolean;
  cancelEditIssue: () => void;
  currentBounty: IssueBigNumberData;
}

export default function BountyBody({
  isEditIssue,
  cancelEditIssue,
  currentBounty
}: BountyBodyControllerProps) {
  const { t } = useTranslation(["common", "bounty"]);

  const [body, setBody] = useState<string>(currentBounty?.body);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentBounty.tags);
  
  const marketplace = useMarketplace();
  const { currentUser } = useUserStore();
  const { mutate: editBounty, isPending: isEditing } = useReactQueryMutation({
    queryKey: QueryKeys.bounty(currentBounty?.id?.toString()),
    mutationFn: useEditBounty,
    toastSuccess: t("bounty:actions.edit-bounty"),
    toastError: t("bounty:errors.failed-to-edit"),
    onSuccess: () => {
      cancelEditIssue();
    }
  });

  function handleCancelEdit() {
    cancelEditIssue();
    setSelectedTags(currentBounty.tags);
  }

  function isDisableUpdateIssue() {
    return (
      isEditing ||
      selectedTags?.length === 0 ||
      body?.length > BODY_CHARACTERES_LIMIT ||
      body?.length === 0
    );
  }

  useEffect(() => {
    if (isEditIssue) return;
    setBody(currentBounty?.body);
  }, [currentBounty?.body]);

  return (
    <BountyBodyView
      walletAddress={currentUser?.walletAddress}
      isDisableUpdateIssue={isDisableUpdateIssue}
      handleCancelEdit={handleCancelEdit}
      handleUpdateBounty={() => editBounty({
        id: currentBounty?.id,
        networkName: marketplace?.active?.name,
        chainName: marketplace?.active?.chain?.chainShortName,
        body: body,
        tags: selectedTags,
      })}
      handleBody={setBody}
      body={body}
      isEditIssue={isEditIssue}
      selectedTags={selectedTags}
      handleSelectedTags={setSelectedTags}
      bounty={currentBounty}
    />
  );
}
