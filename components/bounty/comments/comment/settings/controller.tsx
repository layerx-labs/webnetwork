import { useEffect, useRef, useState } from "react";

import CommentSettingsView from "./view";

export default function CommentSettings({
  handleHide,
  isGovernor,
  hidden,
  updateBountyData,
}: {
  handleHide: () => void;
  isGovernor: boolean;
  hidden: boolean;
  updateBountyData: (updatePrData?: boolean) => void;
}) {
  const node = useRef();

  const [show, setShow] = useState(false);

  function handleClick(e) {
    // @ts-ignore
    if (node.current.contains(e.target)) return;

    setShow(false);
  }

  function loadOutsideClick() {
    if (show) document.addEventListener("mousedown", handleClick);
    else document.removeEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }

  function handleHideComment() {
    handleHide();
    updateBountyData();
    setShow(false);
  }

  useEffect(loadOutsideClick, [show]);

  if(!isGovernor) return null;

  return (
    <CommentSettingsView
      hidden={hidden}
      onHideClick={handleHideComment}
      isGovernor={isGovernor}
      show={show}
      updateShow={setShow}
      refDiv={node}
    />
  );
}
