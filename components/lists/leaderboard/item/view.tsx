import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import ChainIcon from "components/chain-icon";
import CopyButton from "components/common/buttons/copy/controller";
import { OverlappingIcons } from "components/common/overlapping-icons/overlapping-icons.view";
import ResponsiveListItem from "components/common/responsive-list-item/view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";

import {LeaderBoard} from "interfaces/leaderboard";

export default function LeaderBoardListItem(leaderboard: LeaderBoard) {
  const { t } = useTranslation(["leaderboard", "council", "common"]);

  const columns = [
    {
      label: t("nfts"),
      secondaryLabel: <div className="ms-0 ms-md-4">{`${leaderboard?.numberNfts || 0}`}</div>,
      breakpoints: { xs: false, md: true },
      justify: "center"
    },
    {
      label: t("council:council-table.networks"),
      secondaryLabel: <div className="ms-0 mb-2 mb-md-0 ms-md-3">
        <OverlappingIcons
          icons={leaderboard?.networkslogos?.map(icon => (
            <ChainIcon src={icon} size="22" />
          ))}
        />
      </div>,
      breakpoints: { xs: false, md: true },
      justify: "center"
    },
    {
      label: t("common:misc.networks"),
      secondaryLabel: <OverlappingIcons
        icons={leaderboard?.marketplacelogos?.map(icon => (
          <ChainIcon src={icon} size="22" imgFormat="svg" />
        ))}
      />,
      breakpoints: { xs: false, md: true },
      justify: "center"
    }
  ];

  return (
    <ResponsiveListItem
      icon={
        <AvatarOrIdenticon
          size="sm"
          user={{
            address: leaderboard?.address,
            avatar: leaderboard?.user?.avatar
          }}
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