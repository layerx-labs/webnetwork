import { MouseEvent } from "react";

import Button from "components/button";

import { SelectOption } from "types/utils";

interface CheckButtonsViewProps {
  options: SelectOption[];
  getButtonColor: (value: SelectOption) => string;
  onClick: (value: SelectOption) => (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function CheckButtonsView({
  options,
  getButtonColor,
  onClick,
}: CheckButtonsViewProps) {
  return(
    <div className="d-flex">
      {options.map((opt, index) => 
        <Button
          key={`${opt.label}-${index}`}
          color={getButtonColor(opt)}
          className="border-radius-4 text-capitalize font-weight-normal text-gray-50"
          onClick={onClick(opt)}
        >
        {opt.label}
      </Button>)}
    </div>
  );
}