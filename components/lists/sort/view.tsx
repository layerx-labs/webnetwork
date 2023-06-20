import { useTranslation } from "next-i18next";

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
}

export default function ListSortView({
  defaultOption,
  options,
  dropdownItems,
  onChange,
}: ListSortProps) {
  const { t } = useTranslation("common");

  const { isDesktopView } = useBreakPoint();

  function LabelView() {
    return (
      <span className="caption-small text-white-50 text-nowrap mr-1">
        {t("sort.label")}
      </span>
    );
  }

  if (isDesktopView)
    return (
      <>
        <LabelView />
        <ReactSelect
          defaultValue={defaultOption}
          options={options}
          isSearchable={false}
          onChange={onChange}
        />
      </>
    );

  return (
    <>
      <LabelView />
      <NativeSelectWrapper options={options} onChange={onChange}>
        <CustomDropdown
          btnContent={<div className="py-1">{defaultOption?.value}</div>}
          items={dropdownItems}
        />
      </NativeSelectWrapper>
    </>
  );
}
