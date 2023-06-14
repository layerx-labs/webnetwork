import { useRouter } from "next/router";

import ListSortView from "components/lists/sort/view";

<<<<<<<< HEAD:components/lists/sort/controller.tsx
import { CustomDropdownItem, SortOption } from "types/components";
========
import { SortOption } from "types/components";
>>>>>>>> 853189a5 (refactoring components):components/list-sort.tsx

interface ListSortProps {
  defaultOptionIndex?: number;
  options: SortOption[];
}

export default function ListSort({
  defaultOptionIndex = 0,
  options
}: ListSortProps) {
  const router = useRouter();
  const { sortBy, order } = router.query;

  function handleSelectChange(newValue) {
    const query = {
      ...router.query,
      sortBy: newValue.sortBy,
      order: newValue.order,
      page: "1"
    };

    router.push({ pathname: `${router.pathname}`, query }, router.asPath, { shallow: false, scroll: false });
  }

  function getDefaultValue(): SortOption {
    if (sortBy && order) {
      const optionExists = options.find((option) => option.sortBy === sortBy && option.order === order);

      if (optionExists) return optionExists;
    }

    return options[defaultOptionIndex];
  }

  function optionsToDropdownItems(): CustomDropdownItem[] {
    return options?.map(option => ({
      content: option?.label,
      onClick: () => handleSelectChange(option)
    }));
  }


  return (
    <ListSortView
      defaultOption={getDefaultValue()}
      options={options}
      onChange={handleSelectChange}
      dropdownItems={optionsToDropdownItems()}
    />
  );
}
