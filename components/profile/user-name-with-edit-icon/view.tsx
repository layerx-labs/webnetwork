import ProfileEditIcon from "assets/profile-edit-icon";

import Button from "components/button";


interface UserNameWithEditIconProps {
  userName: string;
  onEditClick: () => void;
}

export default function UserNameWithEditIcon({
  userName,
  onEditClick
}: UserNameWithEditIconProps) {

  return(
    <div className="d-flex align-items-center gap-2">
    <h3 className="xl-semibold">
      {userName}
    </h3>
    <Button
        onClick={onEditClick}
        color="gray-900"
        textClass="text-gray-50"
        className="border-radius-8 p-1 not-svg"
        data-test-id="user-edit-icon-btn"
      >
        <ProfileEditIcon />
      </Button>
    </div>
  );
}