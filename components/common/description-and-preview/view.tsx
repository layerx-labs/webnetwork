import React from "react";

import { useTranslation } from "next-i18next";

import BountyLabel from "components/bounty/create-bounty/create-bounty-label";
import { MarkdownEditor } from "components/markdown-editor/markdown-editor.controller";

import { BODY_CHARACTERES_LIMIT } from "helpers/constants";


interface DescriptionAndPreviewViewProps {
  description: string;
  handleChangeDescription: (value: string) => void;
  borderColor?: string;
}

export default function DescriptionAndPreviewView({
  handleChangeDescription,
  description,
  borderColor,
}: DescriptionAndPreviewViewProps) {
  const { t } = useTranslation("bounty");

  return (
    <>
      <BountyLabel className="mb-2" required>
        {t("fields.description.label")}
      </BountyLabel>
      <div className={`p-1 border border-radius-4 border-${borderColor ? borderColor : 'gray-700'}`}>
        <MarkdownEditor
          value={description}
          maxCharacters={BODY_CHARACTERES_LIMIT}
          onChange={handleChangeDescription}
        />
      </div>
    </>
  );
}
