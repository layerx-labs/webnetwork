import ProfileEditIcon from "assets/profile-edit-icon";

import Button from "components/button";


interface UserNameWithEditIconProps {
  userName: string;
  onHandleOnClick: () => void;
}

export default function UserNameWithEditIcon({
  userName,
  onHandleOnClick
}: UserNameWithEditIconProps) {

  return(
    <div className="d-flex align-items-center gap-2">
    <h3 className="xl-semibold">
      {userName}
    </h3>
    <Button
        onClick={onHandleOnClick}
        color="gray-900"
        textClass="text-gray-50"
        className="border-radius-8 p-1 not-svg"
      >
        <ProfileEditIcon />
      </Button>
    </div>
  );
}