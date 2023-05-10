import { ReactNode } from "react";

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
}: MultiActionButtonProps) {
  return(
    <select name="multAction" id="multiAction" size={actions?.length}>
      {actions.map(({ label }, i) => <option value={i}>{label}</option>)}
    </select>
  );
}