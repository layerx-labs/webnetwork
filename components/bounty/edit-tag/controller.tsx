import { BOUNTY_TAGS } from "helpers/constants";

import BountyEditTagView from "./view";

interface BountyEditTagProps {
  isEdit: boolean;
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;
}

export default function BountyEditTag({
  selectedTags,
  setSelectedTags,
  isEdit = false,
}: BountyEditTagProps) {

  function handleChangeTags(newTags) {
    setSelectedTags(newTags.map(({ value }) => value));
  }

  return (
    <BountyEditTagView
      tagsOptions={BOUNTY_TAGS.map(({ type, tags }) => ({
        label: type,
        options: tags.map((tag) => ({
          label: tag,
          value: tag,
        }))
      }))}
      handleChangeTags={handleChangeTags}
      selectedTags={selectedTags}
      isEdit={isEdit}
    />
  );
}
