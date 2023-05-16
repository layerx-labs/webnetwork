import { ReactNode } from "react";

import { ButtonProps } from "components/button";
import IconSingleValue from "components/icon-single-value";
import ReactSelect from "components/react-select";

interface Action {
  onClick: () => void;
  label: string;
}

interface MultiActionButtonProps {
  actions: Action[];
  icon?: ReactNode;
  label: string;
}

export default function MultiActionButton({
  actions,
  icon,
  label,
  ...rest
}: MultiActionButtonProps & ButtonProps) {
  const defaultOption = {
    value: label,
    label: label,
    preIcon: icon
  };

  function actionsToOptions(_actions) {
    return _actions.map((action, index) => ({
      value: index,
      label: action.label
    }));
  }

  return(
    <div className="multi-action-button">
      <ReactSelect
        value={defaultOption}
        options={actionsToOptions(actions)}
        // onChange={onSelectedBranch}
        components={{
          SingleValue: IconSingleValue
        }}
      />
    </div>
  );
}