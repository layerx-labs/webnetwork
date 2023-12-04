import { useTranslation } from "next-i18next";

import VotingPowerSubTitle from "components/profile/pages/voting-power/sub-title/controller";
import VotesAmount from "components/profile/pages/voting-power/total-votes/votes-amount/view";

import {Curator} from "interfaces/curators";

interface TotalVotesProps {
  locked: Curator[];
  delegatedToMe: Curator[];
}

export default function TotalVotes({
  locked,
  delegatedToMe,
} : TotalVotesProps) {
  const { t } = useTranslation(["common", "profile"]);

  return(
    <div className="col border border-gray-800 p-4 border-radius-4 col-12 mb-4">
      <div className="row mb-3 justify-content-between align-items-center flex-wrap">
        <VotingPowerSubTitle 
          label={t("profile:total-votes")}
        />
      </div>

      <VotesAmount
        label={t("profile:locked-by-me")}
        curators={locked}
        className="mb-4"
        type="tokensLocked"
      />

      <VotesAmount
        label={t("profile:deletaged-to-me")}
        curators={delegatedToMe}
        className="mb-4"
        type="delegatedToMe"
      />
    </div>
  );
}