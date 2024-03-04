import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";

import { IFilesProps } from "components/drag-and-drop";

import { BODY_CHARACTERES_LIMIT } from "helpers/constants";
import { addFilesToMarkdown } from "helpers/markdown";
import { QueryKeys } from "helpers/query-keys";

import { IssueBigNumberData } from "interfaces/issue-data";

import { useEditBounty } from "x-hooks/api/task";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";
import { useSettings } from "x-hooks/use-settings";

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
  const [files, setFiles] = useState<IFilesProps[]>([]);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentBounty.tags);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { settings } = useSettings();
  const marketplace = useMarketplace();
  const { currentUser } = useUserStore();
  const { mutate: editBounty, isPending: isEditing } = useReactQueryMutation({
    queryKey: QueryKeys.bounty(currentBounty?.id?.toString()),
    mutationFn: useEditBounty,
    toastSuccess: t("bounty:actions.edit-bounty"),
    toastError: t("bounty:errors.failed-to-edit"),
    onSuccess: () => {
      cancelEditIssue();
      setFiles([]);
      setIsPreview(false);
    }
  });

  function onUpdateFiles(files: IFilesProps[]) {
    return setFiles(files);
  }

  function addFilesInDescription(str) {
    return addFilesToMarkdown(str, files, settings?.urls?.ipfs);
  }

  function handleCancelEdit() {
    setIsPreview(false);
    cancelEditIssue();
    setSelectedTags(currentBounty.tags);
  }

  function isDisableUpdateIssue() {
    return (
      isEditing ||
      isUploading ||
      selectedTags?.length === 0 ||
      addFilesInDescription(body)?.length > BODY_CHARACTERES_LIMIT ||
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
        body: addFilesInDescription(body),
        tags: selectedTags,
      })}
      handleBody={setBody}
      body={body}
      isEditIssue={isEditIssue}
      isPreview={isPreview}
      handleIsPreview={setIsPreview}
      files={files}
      handleFiles={onUpdateFiles}
      selectedTags={selectedTags}
      handleSelectedTags={setSelectedTags}
      isUploading={isEditing || isUploading}
      handleIsUploading={setIsUploading}
      addFilesInDescription={addFilesInDescription}
      bounty={currentBounty}
    />
  );
}
