import { MutableRefObject } from "react";

import { useTranslation } from "next-i18next";

import EyeIcon from "assets/icons/eye-icon";
import EyeSlashIcon from "assets/icons/eye-slash-icon";

interface CommentSettingsViewProps {
  handleHideAction: () => void;
  isGovernor: boolean;
  hidden: boolean;
  show: boolean;
  updateShow: (v: boolean) => void;
  refDiv: MutableRefObject<undefined>;
}

export default function CommentSettingsView({
  handleHideAction,
  isGovernor,
  hidden,
  show,
  updateShow,
  refDiv,
}: CommentSettingsViewProps) {
  const { t } = useTranslation(["common", "pull-request", "bounty"]);

  return (
    <>
      <div
        className="position-relative d-flex justify-content-end"
        ref={refDiv}
      >
        <div
          className={`cursor-pointer settings-comment border-radius-8 d-flex flex-column justify-content-center`}
          onClick={() => updateShow(!show)}
        >
          <span className="container-settings">. . .</span>
        </div>

        <div
          className={`border border-gray-800 border-radius-4 filter-wrapper d-${
            show ? "flex" : "none"
          } justify-content-start align-items-stretch position-absolute`}
        >
          <div className="d-flex gap-2 flex-column bounty-settings p-2 bg-gray-850">
            {isGovernor && (
              <div className="cursor-pointer" onClick={handleHideAction}>
                {hidden ? <EyeIcon /> : <EyeSlashIcon />}{" "}
                {t("common:actions.hide")}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
