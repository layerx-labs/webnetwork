import ProfilePageView from "components/profile/pages/profile-page/view";

import { useUserStore } from "x-hooks/stores/user/user.store";

export default function ProfilePage() {
  const { currentUser } = useUserStore();

  return (
    <ProfilePageView
      walletAddress={currentUser?.walletAddress}
      isCouncil={currentUser?.isCouncil}
    />
  );
}
