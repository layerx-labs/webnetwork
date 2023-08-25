import { useState } from "react";

import CheckButtonsView from "components/check-buttons/view";

import { SelectOption } from "types/utils";

interface CheckButtonsProps {
  options: SelectOption[];
  multiple?: boolean;
  onClick: (value: SelectOption | SelectOption[]) => void;
}

interface SelectedOptions {
  [index: number]: boolean;
}

export default function CheckButtons({
  options,
  multiple,
  onClick,
}: CheckButtonsProps) {
  const [selected, setSelected] = useState<SelectedOptions>({});

  const isSelected = (opt, index) => !!selected[index];
  const toOptionWithSelected = (opt, index) => ({ ...opt, selected: isSelected(opt, index) });

  function handleClick(optionIndex) {
    return () => {
      setSelected(previous => {
        const toggled = { [optionIndex]: !multiple || !previous[optionIndex] };
        const newValue = multiple ? { ...previous, ...toggled } : toggled;
        const newOptions = options.filter((opt, index) => !!newValue[index]);
        onClick(multiple ? newOptions : newOptions.at(0));
        return newValue;
      });
    };
  }

  return(
    <CheckButtonsView
      options={options.map(toOptionWithSelected)}
      onClick={handleClick}
    />
  );
}