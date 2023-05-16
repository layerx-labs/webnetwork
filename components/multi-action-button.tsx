import { ReactNode } from "react";

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
  return(
    <div className="multi-action-button">
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
  );
}