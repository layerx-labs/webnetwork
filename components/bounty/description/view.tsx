import { useTranslation } from "next-i18next";

import { MarkdownEditor } from "components/markdown-editor/markdown-editor.controller";
import MarkedRender from "components/MarkedRender";

import { BODY_CHARACTERES_LIMIT } from "helpers/constants";

interface DescriptionViewProps {
  body: string;
  handleChangeBody: (value: string) => void;
  isEdit?: boolean;
}

export default function BountyDescriptionView({
  body,
  handleChangeBody,
  isEdit,
}: DescriptionViewProps) {
  const { t } = useTranslation(["common", "bounty"]);

  return (
    <>
      <h3 className="caption-medium mb-3">{t("misc.description")}</h3>
      <div className="bg-gray-900 p-3 rounded border border-gray-800">
        <div className="p p-1">
          {isEdit ? (
            <MarkdownEditor
              value={body}
              maxCharacters={BODY_CHARACTERES_LIMIT}
              onChange={handleChangeBody}
            />
          ) : (
            <MarkedRender source={body} />
          )}
        </div>
      </div>
    </>
  );
}
