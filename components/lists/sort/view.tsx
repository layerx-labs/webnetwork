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
  isProfile?: boolean;
}

export default function ListSortView({
  defaultOption,
  options,
  dropdownItems,
  onChange,
  isProfile = false
}: ListSortProps) {
  const { t } = useTranslation("common");
  
  const { isDesktopView } = useBreakPoint();

  function BreakLine({ children }) {
    return isProfile ? <div className="mb-3">{children}</div> : <>{children}</>
  }

  if (isDesktopView || isProfile)
    return (
      <BreakLine>
        <span className="caption-small font-weight-medium text-gray-100 text-nowrap mr-1">
          {t("sort.label")}
        </span>

        <ReactSelect
          defaultValue={defaultOption}
          options={options}
          isSearchable={false}
          onChange={onChange}
        />
      </BreakLine>
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
