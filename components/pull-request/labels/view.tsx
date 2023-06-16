import React from "react";

import { PRLabel } from "./controller";

export interface PRLabelView {
    state: PRLabel;
    getPullRequestLabelClass: () => string;
    getColorLabel: () => "success" | "primary" | "danger" | "info" | "orange-500" | "white";
}

export default function PullRequestLabelsView({
    state,
    getPullRequestLabelClass,
    getColorLabel
}: PRLabelView) {

  return (
    <div className={getPullRequestLabelClass()}>
      <span
        className={`caption-small text-uppercase text-${getColorLabel()} mx-1 text-nowrap`}
      >
        {state}
      </span>
    </div>
  );
}