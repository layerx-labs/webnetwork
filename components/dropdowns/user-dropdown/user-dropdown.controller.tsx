import { ReactNode } from "react";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import NativeSelectWrapper from "components/common/native-select-wrapper/view";
import IconOption from "components/icon-option";
import IconSingleValue from "components/icon-single-value";
import ReactSelect from "components/react-select";

import { getUserLabel } from "helpers/user";

import { User } from "interfaces/api";

interface UserDropdownProps {
  selectedUser: User;
  users: User[];
  onChange: (user: User) => void;
}

interface UserOption {
  label: string;
  value: User;
  preIcon: ReactNode;
}

export function UserDropdown({
  selectedUser,
  users,
  onChange
}: UserDropdownProps) {
  function userToOption(user: User): UserOption {
    return {
      value: user,
      label: getUserLabel(user),
      preIcon: <AvatarOrIdenticon user={user} size="xsm" />,
    };
  }

  function getNativeOptions() {
    return users.map((user, index) => ({
      label: getUserLabel(user),
      value: index,
    }));
  }

  function onNativeChange(selectedOption) {
    onChange(users[selectedOption?.value]);
  }

  function onSelectChange(option) {
    onChange(option.value);
  }

  return(
    <NativeSelectWrapper
      options={getNativeOptions()}
      onChange={onNativeChange}
    >
      <ReactSelect
        options={users.map(userToOption)}
        value={selectedUser}
        onChange={onSelectChange}
        placeholder={"Select a user"}
        isSearchable={false}
        components={{
          Option: IconOption,
          SingleValue: IconSingleValue
        }}
      />
    </NativeSelectWrapper>
  );
}