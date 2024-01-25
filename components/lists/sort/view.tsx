import clsx from "clsx";
import { useTranslation } from "next-i18next";

import FilterIcon from "assets/icons/filter-icon";

import CustomDropdown from "components/common/custom-dropdown/view";
import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import ReactSelect from "components/react-select";

import { CustomDropdownItem, SortOption } from "types/components";

interface ListSortProps {
  defaultOption?: SortOption;
  options: SortOption[];
  dropdownItems: CustomDropdownItem[];
  asSelect?: boolean;
  rounded?: boolean;
  selectedIndex?: number;
  componentVersion: string;
  labelColor?: string;
  onChange: (newValue: SortOption) => void;
  labelLineBreak?: boolean;
}

export default function ListSortView({
  defaultOption,
  options,
  dropdownItems,
  selectedIndex,
  rounded,
  onChange,
  labelLineBreak = false,
  componentVersion,
  asSelect,
  labelColor
}: ListSortProps) {
  const { t } = useTranslation("common");

  const labelClass = clsx([
    "sm-regular",
    `text-${labelColor || "white"}`,
    (asSelect || labelLineBreak) ? "font-weight-medium text-capitalize" : "text-nowrap mr-1",
  ]);
  const containerClass = clsx([
    "d-flex",
    rounded ? "rounded-select" : "",
    (asSelect || labelLineBreak) ? "flex-column gap-1" : "align-items-center"
  ]);

  if (!componentVersion)
    return <></>;

  if (componentVersion === "desktop" || asSelect || labelLineBreak)
    return (
      <div className={containerClass}>
        <span className={labelClass}>
          {t("sort.label")}
        </span>

        <NativeSelectWrapper
          options={options}
          onChange={onChange}
          selectedIndex={selectedIndex}
        >
          <ReactSelect
            defaultValue={defaultOption}
            inputProps={{ 'data-testid': 'sort-by-select' }}
            options={options}
            isSearchable={false}
            onChange={onChange}
          />
        </NativeSelectWrapper>
      </div>
    );

  return (
    <NativeSelectWrapper
      options={options}
      onChange={onChange}
      selectedIndex={selectedIndex}
    >
      <CustomDropdown
        btnContent={<FilterIcon width={16} height={16} />}
        items={dropdownItems}
      />
    </NativeSelectWrapper>
  );
}
