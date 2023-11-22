import { useTranslation } from "next-i18next";

import ChainIcon from "components/chain-icon";
import CopyButton from "components/common/buttons/copy/controller";
import { OverlappingIcons } from "components/common/overlapping-icons/overlapping-icons.view";
import ResponsiveListItem from "components/common/responsive-list-item/view";
import Identicon from "components/identicon";

import { truncateAddress } from "helpers/truncate-address";
import { truncateString } from "helpers/truncate-string";

import { LeaderBoard } from "interfaces/leaderboard";

export default function LeaderBoardListItem(leaderboard: LeaderBoard) {
  const { t } = useTranslation(["leaderboard", "council", "common"]);

  const columns = [
    {
      secondaryLabel: truncateString(leaderboard?.user?.githubLogin, 15) || "-",
      breakpoints: { xs: false, xl: true },
      justify: "center",
    },
    {
      label: t("nfts"),
      secondaryLabel: `${leaderboard?.numberNfts || 0}`,
      breakpoints: { xs: false, md: true },
      justify: "center"
    },
    {
      label: t("council:council-table.networks"),
      secondaryLabel: <OverlappingIcons
        icons={leaderboard?.networkslogos?.map(icon => (
          <ChainIcon src={icon} size="22" />
        ))}
      />,
      breakpoints: { xs: false, md: true },
      justify: "center"
    },
    {
      label: t("common:misc.networks"),
      secondaryLabel: <OverlappingIcons
        icons={leaderboard?.marketplacelogos?.map(icon => (
          <ChainIcon src={icon} size="22" />
        ))}
      />,
      breakpoints: { xs: false, md: true },
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
      label={truncateAddress(leaderboard?.address)}
      columns={columns}
      mobileColumnIndex={[1, 2, 3]}
      action={
        <CopyButton
          value={leaderboard?.address}
          popOverLabel={t("leaderboard:address-copied")}
        />
      }
    />
  );
}