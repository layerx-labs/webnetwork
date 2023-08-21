import { useState } from "react";

import CheckButtonsView from "components/check-buttons/view";

import { SelectOption } from "types/utils";

interface CheckButtonsProps {
  options: SelectOption[];
  multiple?: boolean;
  onClick: (value: SelectOption | SelectOption[]) => void;
}

export default function CheckButtons({
  options,
  multiple,
  onClick,
}: CheckButtonsProps) {
  const [selected, setSelected] = useState<SelectOption[]>([]);

  const findIndex = (opt, opts) => opts.findIndex(({ value }) => value === opt.value);
  const isSelected = (opt, opts) => findIndex(opt, opts) > -1;

  function handleClick(option) {
    return () => {
      if (!multiple) {
        setSelected([option]);
        onClick(option);
      } else
        setSelected(previous => {
          const found = findIndex(option, previous);
          const newSelected = isSelected(option, previous) ? previous.toSpliced(found, 1) : [...previous, option];

          onClick(newSelected);

          return newSelected;
        });
    };
  }

  function getButtonColor(opt) {
    if (isSelected(opt, selected))
      return "primary";

    return "gray-900 border-gray-700";
  }

  return(
    <CheckButtonsView
      options={options}
      getButtonColor={getButtonColor}
      onClick={handleClick}
    />
  );
}