import { useEffect } from "react";

import { PROGRAMMING_LANGUAGES } from "assets/bounty-labels";

import { useAppState } from "contexts/app-state";

import BountyEditTagView from "./view";

interface BountyEditTagControllerProps {
  isEdit: boolean;
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;
  preview?: boolean;
}

export default function BountyEditTagController({
  selectedTags,
  setSelectedTags,
  isEdit = false,
  preview = false,
}: BountyEditTagControllerProps) {
  const { state } = useAppState();

  const TAGS_OPTIONS = PROGRAMMING_LANGUAGES.map(({ tag }) => ({
    label: tag,
    value: tag,
  }));

  function handleChangeTags(newTags) {
    setSelectedTags(newTags.map(({ value }) => value));
  }

  useEffect(() => {
    setSelectedTags(TAGS_OPTIONS.filter((tag) =>
        state.currentBounty?.data?.tags?.includes(tag.value)).map((e) => e.value));
  }, [state.currentBounty?.data?.tags]);

  return (
    <BountyEditTagView
      tagsOptions={TAGS_OPTIONS}
      handleChangeTags={handleChangeTags}
      selectedTags={selectedTags}
      preview={preview}
      isEdit={isEdit}
    />
  );
}
