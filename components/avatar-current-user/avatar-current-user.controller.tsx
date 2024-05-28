import AvatarOrIdenticon, { AvatarOrIdenticonProps } from "components/avatar-or-identicon";

import { useUserStore } from "x-hooks/stores/user/user.store";

type AvatarCurrentUserProps = Omit<AvatarOrIdenticonProps, "user">;

export function AvatarCurrentUser(props: AvatarCurrentUserProps) {
  const { currentUser } = useUserStore();

  return(
    <AvatarOrIdenticon
      user={{
        address: currentUser?.walletAddress,
        handle: currentUser?.login,
        avatar: currentUser?.avatar
      }}
      {...props}
    />
  );
}