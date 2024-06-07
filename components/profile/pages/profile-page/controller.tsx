import ProfilePageView from "components/profile/pages/profile-page/view";

import {useUserStore} from "x-hooks/stores/user/user.store";
import { userPointsOfUser } from "x-hooks/use-points-of-user";

export default function DashboardPage() {
  const { currentUser } = useUserStore();
  const { totalPoints } = userPointsOfUser();

  return (
    <ProfilePageView
      walletAddress={currentUser?.walletAddress}
      isCouncil={currentUser?.isCouncil}
      totalPoints={totalPoints}
    />
  );
}
