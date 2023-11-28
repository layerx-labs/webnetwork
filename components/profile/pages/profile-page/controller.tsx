import ProfilePageView from "components/profile/pages/profile-page/view";

import {useAppState} from "contexts/app-state";

export default function ProfilePage() {
  const { state } = useAppState();

  return (
    <ProfilePageView
      walletAddress={state.currentUser?.walletAddress}
      isCouncil={state.currentUser?.isCouncil}
    />
  );
}
