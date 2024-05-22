import {useEffect} from "react";

import { useRouter } from "next/router";

import {CollectedPointsView} from "components/points-system/collected-points/collected-points.view";

import {PointsEvents} from "interfaces/points";

import useMarketplace from "x-hooks/use-marketplace";
import {userPointsOfUser} from "x-hooks/use-points-of-user";

export function CollectedPoints() {
  const { push } = useRouter();

  const { goToProfilePage } = useMarketplace();
  const { collectedPoints, pointsBase, refresh } = userPointsOfUser();

  const getCollected = (actionName: string) => collectedPoints?.find(c => c.actionName === actionName);
  const getPointStatus = (event: PointsEvents) => {
    if (!event)
      return "available";
    if (!event.pointsCounted)
      return "pending";
    return "claimed";
  };
  const getSocialName = (actionName: string) => {
    if (actionName?.includes("linkedin"))
      return "linkedin";
    if (actionName?.includes("github"))
      return "github";
    if (actionName?.includes("twitter"))
      return "x";
  };
  const actions = {
    "created_marketplace": () => push("/new-marketplace"),
    "created_deliverable": () => push("/explore"),
    "created_proposal": () => push("/explore"),
    "accepted_proposal": () => goToProfilePage("proposals"),
    "add_linkedin": () => push("/dashboard"),
    "add_github": () => push("/dashboard"),
    "connect_email": () => push("/dashboard"),
    "add_about": () => push("/dashboard"),
    "add_twitter": () => push("/dashboard"),
  };

  const { onGoing, socials, profile, other } = pointsBase.reduce((acc, curr) => {
    const collected = getCollected(curr.actionName);
    const status = getPointStatus(collected);
    const pointsPerAction = status === "available" ? curr.pointsPerAction * curr.scalingFactor : collected.pointsWon;
    const currUpdated = {
      ...curr,
      status,
      pointsPerAction,
      onActionClick: actions[curr.actionName],
    };

    if (["linkedin", "github", "twitter"].some(social => curr.actionName.includes(social)))
      acc.socials.push(currUpdated);
    else if (["email", "add_about"].some(e => curr.actionName.includes(e)))
      acc.profile.push(currUpdated);
    else if (curr.counter === "N")
      acc.onGoing.push(curr);
    else
      acc.other.push(currUpdated);

    return acc;
  }, { onGoing: [], socials: [], profile: [], other: [] });

  useEffect(() => {
    refresh()
  }, []);

  return(
    <CollectedPointsView
      onGoing={onGoing}
      socials={socials}
      profile={profile}
      other={other}
      getSocialName={getSocialName}
    />
  );
}