import { ReactNode, useRef } from "react";

import Button, { ButtonProps } from "components/button";

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
  const selectRef = useRef<HTMLSelectElement>(null);

  function onBtnClick() {
    if (selectRef.current)
      selectRef.current.click();
  }

  return(
    <div className="multi-action-button">
      <Button
        {...rest}
        onClick={onBtnClick}
      >
        {icon}
        <span>{label}</span>
      </Button>

      <select
        name="multiAction"
        id="multiAction"
        ref={selectRef}
      >
        {actions.map(({ label }, i) => <option value={i}>{label}</option>)}
      </select>
    </div>
  );
}