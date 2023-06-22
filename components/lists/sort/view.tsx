import { useTranslation } from "next-i18next";

import FilterIcon from "assets/icons/filter-icon";

import CustomDropdown from "components/common/custom-dropdown/view";
import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import ReactSelect from "components/react-select";

import { CustomDropdownItem, SortOption } from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

interface ListSortProps {
  defaultOption?: SortOption;
  options: SortOption[];
  dropdownItems: CustomDropdownItem[];
  onChange: (newValue: SortOption) => void;
  labelLineBreak?: boolean;
}

export default function ListSortView({
  defaultOption,
  options,
  dropdownItems,
  onChange,
  labelLineBreak = false
}: ListSortProps) {
  const { t } = useTranslation("common");
  
  const { isDesktopView } = useBreakPoint();

  if (isDesktopView || labelLineBreak)
    return (
      <div className={labelLineBreak ? 'mb-3' : 'd-flex align-items-center'}>
        <span className="caption-small font-weight-medium text-gray-100 text-nowrap mr-1">
          {t("sort.label")}
        </span>

        <ReactSelect
          defaultValue={defaultOption}
          options={options}
          isSearchable={false}
          onChange={onChange}
        />
      </div>
    );

  return (
    <NativeSelectWrapper
      options={options}
      onChange={onChange}
    >
      <CustomDropdown
        btnContent={<FilterIcon width={16} height={16} />}
        items={dropdownItems}
      />
    </NativeSelectWrapper>
  );
}
