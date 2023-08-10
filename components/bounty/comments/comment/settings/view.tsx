import { useEffect, useRef, useState } from "react";

import { useTranslation } from "next-i18next";

import EyeIcon from "assets/icons/eye-icon";
import EyeSlashIcon from "assets/icons/eye-slash-icon";

interface CommentSettingsViewProps {
  handleHideAction: () => void;
  isGovernor: boolean;
  hidden: boolean;
}

export default function CommentSettingsView({
  handleHideAction,
  isGovernor,
  hidden,
}: CommentSettingsViewProps) {
  const { t } = useTranslation(["common", "pull-request", "bounty"]);
  const node = useRef();

  const [show, setShow] = useState(false);

  function handleHide() {
    setShow(false);
  }

  function handleClick(e) {
    // @ts-ignore
    if (node.current.contains(e.target)) return;

    handleHide();
  }

  function loadOutsideClick() {
    if (show) document.addEventListener("mousedown", handleClick);
    else document.removeEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }

  function handleHideActionClick() {
    handleHide();
    handleHideAction();
  }

  function renderHideButton() {
    if (isGovernor)
      return (
        <span className="cursor-pointer" onClick={handleHideActionClick}>
          {hidden ? <EyeIcon /> : <EyeSlashIcon />}{" "}
          {t("common:actions.hide")}
        </span>
      );
  }

  useEffect(loadOutsideClick, [show]);

  return (
    <>
      <div className="position-relative d-flex justify-content-end" ref={node}>
        <div
          className={`cursor-pointer settings-comment border-radius-8 d-flex`}
          onClick={() => setShow(!show)}
        >
          <span className="mx-2 mb-2">. . .</span>
        </div>

        <div
          className={`border border-gray-800 border-radius-4 filter-wrapper d-${
            show ? "flex" : "none"
          } justify-content-start align-items-stretch position-absolute`}
        >
          <div className="d-flex gap-2 flex-column bounty-settings p-2 bg-gray-850">
            {renderHideButton()}
          </div>
        </div>
      </div>
    </>
  );
}
