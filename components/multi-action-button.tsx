import { ReactNode } from "react";

import Button, { ButtonProps } from "components/button";
import IconSingleValue from "components/icon-single-value";
import ReactSelect from "components/react-select";
import ResponsiveWrapper from "components/responsive-wrapper";

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
  }

  function actionsToOptions(_actions) {
    return _actions.map((action, index) => ({
      value: index,
      label: action.label
    }));
  }

  return(
    <div className="multi-action-button">
      <ResponsiveWrapper
        xs={true}
        xl={false}
      >
        <div className="select-container">
          <Button
            {...rest}
          >
            {icon}
            <span>{label}</span>
          </Button>
          <select
            className="native-select"
            name="multiAction"
            id="multiAction"
          >
            {actions.map(({ label }, i) => <option value={i}>{label}</option>)}
          </select>
        </div>
      </ResponsiveWrapper>

      <ResponsiveWrapper
        xs={false}
        xl={true}
      >
        <ReactSelect
          options={actionsToOptions(actions)}
          value={defaultOption}
          isSearchable={false}
          components={{
            DropdownIndicator:() => null, 
            IndicatorSeparator:() => null,
            SingleValue: IconSingleValue
          }}
          name="multiAction"
          id="multiAction"
        />
      </ResponsiveWrapper>
    </div>
  );
}