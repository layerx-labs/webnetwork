import { useTranslation } from "next-i18next";

import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import { UserOption } from "components/dropdowns/user-dropdown/user-dropdown.controller";
import IconOption from "components/icon-option";
import IconSingleValue from "components/icon-single-value";
import ReactSelect from "components/react-select";

import { User } from "interfaces/api";

import { SelectOption } from "types/utils";

interface UserDropdownViewProps {
  selectedUser: User;
  options: UserOption[];
  nativeOptions: SelectOption[];
  onChange: (user: User) => void;
  onNativeChange: (value) => void;
}

export function UserDropdownView({
  selectedUser,
  options,
  nativeOptions,
  onChange,
  onNativeChange,
}: UserDropdownViewProps) {
  const { t } = useTranslation("common");

  return(
    <NativeSelectWrapper
      options={nativeOptions}
      onChange={onNativeChange}
    >
      <ReactSelect
        options={options}
        value={selectedUser}
        onChange={onChange}
        placeholder={t("placeholders.select-a-user")}
        isSearchable={false}
        components={{
          Option: IconOption,
          SingleValue: IconSingleValue
        }}
      />
    </NativeSelectWrapper>
  );
}