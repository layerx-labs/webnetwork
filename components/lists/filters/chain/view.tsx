import { useTranslation } from "next-i18next";

import ReactSelect from "components/react-select";

import { SelectOption } from "types/utils";

interface ChainFilterViewProps {
  options: SelectOption[];
  option: SelectOption;
  onChange: (value: SelectOption) => void;
}

export default function ChainFilterView({
  options,
  option,
  onChange,
}: ChainFilterViewProps) {
  const { t } = useTranslation("common");
  
  return(
    <div className="row align-items-center gx-2">
      <div className="col-auto">
        <label className="text-capitalize text-white font-weight-normal caption-medium">
          {t("misc.chain")}
        </label>
      </div>

      <div className="col">
        <ReactSelect
          options={options}
          value={option}
          onChange={onChange}
          isSearchable={false}
          isClearable
        />
      </div>
    </div>
  );
}