import getConfig from "next/config";

import Avatar from "components/avatar"
import Identicon from "components/identicon"

import { SizeOptions } from "interfaces/utils";

interface AvatarOrIdenticonProps {
  avatarHash?: string;
  address?: string;
  userHandle?: string;
  size?: SizeOptions | number;
  withBorder?: boolean;
  active?: boolean;
}

const { publicRuntimeConfig } = getConfig();

export default function AvatarOrIdenticon({
  avatarHash,
  address,
  userHandle,
  size = "md",
  withBorder,
  active = false
} : AvatarOrIdenticonProps ) {

  if (!avatarHash && !address) return <></>;

  return(
    <div className={`${withBorder ? "border-avatar p-1" : ""} ${withBorder && active ? "active" : ""}`}
    data-testid="avatar-or-identicon">
      { 
        avatarHash ? 
        <Avatar 
          userLogin={userHandle} 
          size={size} 
          src={`${publicRuntimeConfig?.urls?.ipfs}/${avatarHash}`}
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