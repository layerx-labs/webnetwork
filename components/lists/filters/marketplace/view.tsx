import { useTranslation } from "next-i18next";

import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import IconOption from "components/icon-option";
import IconSingleValue from "components/icon-single-value";
import If from "components/If";
import ReactSelect from "components/react-select";

import { Direction, SelectOption } from "types/utils";

interface ChainFilterViewProps {
  options: SelectOption[];
  option: SelectOption;
  direction: Direction;
  isMobile: boolean;
  onChange: (value: SelectOption) => void;
  label: boolean;
}

export default function MarketplaceFilterView({
  options,
  option,
  direction,
  isMobile,
  onChange,
  label
}: ChainFilterViewProps) {
  const { t } = useTranslation("common");

  const isHorizontal = direction === "horizontal";
  const labelClass = isHorizontal ? "col-auto" : "col-12";
  
  return(
    <div className="row align-items-center gx-2 gy-2">
      <If condition={label}>
        <div className={labelClass}>
          <label className="text-capitalize text-white font-weight-normal sm-regular">
            {t("misc.chain")}
          </label>
        </div>
      </If>

      <div className="col" data-testid="marketplace-filter">
        <NativeSelectWrapper
          options={options}
          onChange={onChange}
          selectedIndex={options?.findIndex(opt => opt?.value === option?.value)}
          isClearable
        >
          <ReactSelect
            options={options}
            value={option}
            onChange={onChange}
            inputProps={{ 'data-testid': 'marketplace-select' }}
            isSearchable={false}
            placeholder={t("placeholders.select-marketplace")}
            isClearable={!isMobile}
            components={{
              Option: IconOption,
              SingleValue: IconSingleValue,
            }}
          />
        </NativeSelectWrapper>
      </div>
    </div>
  );
}