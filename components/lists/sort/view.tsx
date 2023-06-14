import { useTranslation } from "next-i18next";

import CustomDropdown from "components/common/custom-dropdown/view";
import ReactSelect from "components/react-select";

import { SortOption } from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

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
  const { t } = useTranslation("common");
  
  const { isDesktopView } = useBreakPoint();

  if (isDesktopView)
    return (
      <>
        <span className="caption-small text-white-50 text-nowrap mr-1">
          {t("sort.label")}
        </span>

        <ReactSelect
          defaultValue={defaultOption}
          options={options}
          isSearchable={false}
          onChange={onChange}
        />
      </>
    );

  return (
    <CustomDropdown
    />
  );
}
