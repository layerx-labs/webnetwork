import getConfig from "next/config";

import Avatar from "components/avatar"
import Identicon from "components/identicon"
import If from "components/If";

import {truncateAddress} from "helpers/truncate-address";

import {User} from "interfaces/api";
import {SizeOptions} from "interfaces/utils";

import {baseApiImgUrl} from "../services/api";

export interface AvatarOrIdenticonProps {
  user: User | { address: string; handle?: string; avatar?: string; };
  size?: SizeOptions | number;
  withBorder?: boolean;
  active?: boolean;
}

const { publicRuntimeConfig } = getConfig();

export default function AvatarOrIdenticon({
  user,
  size = "md",
  withBorder,
  active = false
} : AvatarOrIdenticonProps ) {
  if (!user) 
    return <></>;

  const avatar = user.avatar;
  const address = user.address;
  const handle = user.handle ?? truncateAddress(address);

  return(
    <div 
      className={`${withBorder ? "border-avatar p-1" : ""} ${withBorder && active ? "active" : ""}`}
      data-testid="avatar-or-identicon"
    >
      <If 
        condition={!!avatar}
        otherwise={
          <Identicon 
            address={address}
            size={size}
          />
        }
      >
        <Avatar 
          userLogin={handle} 
          size={size} 
          src={`${baseApiImgUrl}/${publicRuntimeConfig?.urls?.ipfs}/${avatar}?width=100&height=100`}
          className="border-primary" 
        />
      </If>
    </div>
  );
}