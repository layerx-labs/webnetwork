import { ReactNode, useEffect, useState } from "react";
import { isMobile } from 'react-device-detect';

import { useTranslation } from "next-i18next";

import Button, { ButtonProps } from "components/button";
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
  const { t } = useTranslation("common");
  
  const [mobile, setMobile] = useState(false);

  const defaultOption = {
    value: label,
    label: label,
    preIcon: icon,
    justify: "center"
  }

  function actionsToOptions(_actions) {
    return _actions.map((action, index) => ({
      value: index,
      label: action.label
    }));
  }

  function executeAction(actionIndex) {
    actions[actionIndex]?.onClick();
  }

  function onNativeChange(evt) {
    executeAction(evt.target.value);
  }

  function onRSChange(newValue) {
    executeAction(newValue.value);
  }

  useEffect(() => {
    setMobile(isMobile);
  }, []);

  return(
    <div className="multi-action-button">
      { mobile &&
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
            onChange={onNativeChange}
            value="choose"
          >
            <option value="choose" disabled hidden>{t("misc.choose-one")}</option>
            {actions.map(({ label }, i) => <option value={i} key={label}>{label}</option>)}
          </select>
        </div> ||
        <ReactSelect
          options={actionsToOptions(actions)}
          value={defaultOption}
          isSearchable={false}
          onChange={onRSChange}
          components={{
            DropdownIndicator:() => null, 
            IndicatorSeparator:() => null,
            SingleValue: IconSingleValue
          }}
          name="multiAction"
          id="multiAction"
        />
      }
    </div>
  );
}