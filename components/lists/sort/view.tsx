import ReactSelect from "components/react-select";

import { SortOption } from "types/components";

interface ListSortProps {
  defaultOption?: SortOption;
  options: SortOption[];
  onChange: (newValue: SortOption) => void;
}

export default function ListSortView({
  defaultOption,
  options,
  onChange
}: ListSortProps) {

  return (
    <ReactSelect
      defaultValue={defaultOption}
      options={options}
      isSearchable={false}
      onChange={onChange}
    />
  );
}
