import Avatar from "components/avatar"
import Identicon from "components/identicon"

import { SizeOptions } from "interfaces/utils";

interface AvatarOrIdenticonProps {
  avatarUrl?: string;
  address?: string;
  userHandle?: string;
  size?: SizeOptions | number;
  withBorder?: boolean;
  active?: boolean;
}

export default function AvatarOrIdenticon({
  avatarUrl,
  address,
  userHandle,
  size = "md",
  withBorder,
  active = false
} : AvatarOrIdenticonProps ) {

  if (!avatarUrl && !address) return <></>;

  return(
    <div className={`${withBorder ? "border-avatar p-1" : ""} ${withBorder && active ? "active" : ""}`}
    data-testid="avatar-or-identicon">
      { 
        avatarUrl ? 
        <Avatar 
          userLogin={userHandle} 
          size={size} 
          src={avatarUrl}
          className="border-primary" 
        /> :
        <Identicon 
          address={address}
          size={size}
        />
      }
    </div>
  );
}