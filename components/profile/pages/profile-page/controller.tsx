import ProfilePageView from "components/profile/pages/profile-page/view";

import {useUserStore} from "x-hooks/stores/user/user.store";

export default function DashboardPage() {
  const { currentUser } = useUserStore();



  return (
    <ProfilePageView
      walletAddress={currentUser?.walletAddress}
      handle={currentUser?.login}
      isCouncil={currentUser?.isCouncil}
    />
  );
}
