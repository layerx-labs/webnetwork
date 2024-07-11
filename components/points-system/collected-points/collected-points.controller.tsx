import {useEffect} from "react";

import {useRouter} from "next/router";

import {CollectedPointsView} from "components/points-system/collected-points/collected-points.view";

import {PointsBase, PointsEvents} from "interfaces/points";

import useMarketplace from "x-hooks/use-marketplace";
import {userPointsOfUser} from "x-hooks/use-points-of-user";

export function CollectedPoints() {
  const { push } = useRouter();

  const { goToProfilePage } = useMarketplace();
  const { collectedPoints, pointsBase, refresh } = userPointsOfUser();

  const getCollected = (actionName: string) => collectedPoints?.find(c => c.actionName === actionName);
  const getPointStatus = (rule: PointsBase, event: PointsEvents) => {
    if (rule?.counter !== "N") {
      if (event?.pointsCounted)
        return "collected";
      if (event)
        return "pending";
    }
    if (rule?.scalingFactor > 1)
      return "boosted";
    return "available";
  };

  const actions = {
    "created_task": () => push("/create-task"),
    "give_funding_reward": () => push("/create-task"),
    "delegated": () => goToProfilePage("voting-power"),
    "locked": () => goToProfilePage("voting-power"),
    "created_marketplace": () => push("/new-marketplace"),
    "created_deliverable": () => push("/explore"),
    "funded_funding_request": () => push("/explore"),
    "created_proposal": () => push("/explore"),
    "accepted_proposal": () => goToProfilePage("proposals"),
    "add_linkedin": () => push("/dashboard"),
    "add_github": () => push("/dashboard"),
    "connect_email": () => push("/dashboard"),
    "add_about": () => push("/dashboard"),
    "add_twitter": () => push("/dashboard"),
    "add_avatar": () => push("/dashboard"),
  };

  const { recurring, available, collected } = pointsBase.reduce((acc, curr) => {
    const collected = getCollected(curr.actionName);
    const status = getPointStatus(curr, collected);
    const pointsPerAction = status === "available" || status === "boosted" 
      ? curr.pointsPerAction * curr.scalingFactor : collected.pointsWon;
    const currUpdated = {
      ...curr,
      status,
      pointsPerAction,
      onActionClick: actions[curr.actionName],
    };

    if (curr.counter === "N")
      acc.recurring.push(currUpdated);
    else if (status === "pending" || status === "collected")
      acc.collected.push(currUpdated);
    else
      acc.available.push(currUpdated);

    return acc;
  }, { recurring: [], available: [], collected: [] });

  useEffect(() => {
    refresh()
  }, []);

  return(
    <CollectedPointsView
      recurring={recurring}
      available={available}
      collected={collected}
    />
  );
}