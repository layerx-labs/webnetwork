import { ReactNode } from "react";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import { UserDropdownView } from "components/dropdowns/user-dropdown/user-dropdown.view";

import { getUserLabel } from "helpers/user";

import { User } from "interfaces/api";

interface UserDropdownProps {
  selectedUser: User;
  users: User[];
  onChange: (user: User) => void;
}

export interface UserOption {
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
    <UserDropdownView
      selectedUser={selectedUser}
      options={users.map(userToOption)}
      nativeOptions={getNativeOptions()}
      onChange={onSelectChange}
      onNativeChange={onNativeChange}
    />
  );
}