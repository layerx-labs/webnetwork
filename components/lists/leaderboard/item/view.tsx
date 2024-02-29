import {useTranslation} from "next-i18next";

import ChainIcon from "components/chain-icon";
import CopyButton from "components/common/buttons/copy/controller";
import { OverlappingIcons } from "components/common/overlapping-icons/overlapping-icons.view";
import ResponsiveListItem from "components/common/responsive-list-item/view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";
import Identicon from "components/identicon";

import { truncateString } from "helpers/truncate-string";

import {LeaderBoard} from "interfaces/leaderboard";

export default function LeaderBoardListItem(leaderboard: LeaderBoard) {
  const { t } = useTranslation(["leaderboard", "council", "common"]);

  const columns = [
    {
      secondaryLabel: truncateString(leaderboard?.user?.handle, 15) || "-",
      visibility: { mobile: false, desktop: true },
      justify: "center",
    },
    {
      label: t("nfts"),
      secondaryLabel: `${leaderboard?.numberNfts || 0}`,
      visibility: { mobile: false, tablet: true },
      justify: "center"
    },
    {
      label: t("council:council-table.networks"),
      secondaryLabel: <OverlappingIcons
        icons={leaderboard?.networkslogos?.map(icon => (
          <ChainIcon src={icon} size="22" />
        ))}
      />,
      visibility: { mobile: false, tablet: true },
      justify: "center"
    },
    {
      label: t("common:misc.networks"),
      secondaryLabel: <OverlappingIcons
        icons={leaderboard?.marketplacelogos?.map(icon => (
          <ChainIcon src={icon} size="22" />
        ))}
      />,
      visibility: { mobile: false, tablet: true },
      justify: "center"
    }
  ];

  return (
    <ResponsiveListItem
      icon={
        <Identicon 
          size="sm"
          address={leaderboard?.address}
        />
      }
      label={<UserProfileLink address={leaderboard?.address} handle={leaderboard?.user?.handle} />}
      columns={columns}
      mobileColumnIndex={[1, 2, 3]}
      action={
        <CopyButton
          value={leaderboard?.address}
          popOverLabel={t("leaderboard:address-copied")}
          title={t("common:misc.copy-address")}
        />
      }
    />
  );
}