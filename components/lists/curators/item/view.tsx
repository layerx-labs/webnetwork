import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import ChainIcon from "components/chain-icon";
import CopyButton from "components/common/buttons/copy/controller";
import {OverlappingIcons} from "components/common/overlapping-icons/overlapping-icons.view";
import ResponsiveListItem from "components/common/responsive-list-item/view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";
import Identicon from "components/identicon";

import { formatNumberToNScale } from "helpers/formatNumber";

import {CuratorOverview} from "types/api";

interface CuratorListItemProps {
  curator: CuratorOverview;
}

export default function CuratorListItemView({
  curator
}: CuratorListItemProps) {
  const { t } = useTranslation(["common", "council"]);

  const columns = [
    {
      label: t("council:council-table.closed-proposals"),
      secondaryLabel: <div className="ms-0 ms-md-3">{`${curator?.acceptedProposals || 0}`}</div>,
      breakpoints: { xs: false, lg: true },
      justify: "start"
    },
    {
      label: t("council:council-table.disputed-proposals"),
      secondaryLabel: <div className="ms-0 ms-md-4">{`${curator?.disputedProposals || 0}`}</div>,
      breakpoints: { xs: false, xl: true },
      justify: "start"
    },
    {
      label: t("council:council-table.disputes"),
      secondaryLabel: <div className="ms-0 ms-md-4 ps-md-2">{`${curator?.disputes || 0}`}</div>,
      breakpoints: { xs: false, xl: true },
      justify: "start"
    },
    {
      label: t("council:council-table.total-votes"),
      secondaryLabel: <div className="ms-0 ms-md-3">
        {formatNumberToNScale(BigNumber(curator?.totalVotes).toFixed())}
      </div>,
      breakpoints: { xs: false, md: true },
      justify: "start"
    },
    {
      label: t("council:council-table.networks"),
      secondaryLabel: <OverlappingIcons
      icons={curator?.marketplaces?.map(marketplace => (
        <ChainIcon src={marketplace?.chain?.icon} size="22" />
      ))}
    />,
      breakpoints: { xs: false, md: true },
      justify: "center"
    }
  ];
  
  return(
    <ResponsiveListItem
      icon={
        <Identicon
          size="sm"
          address={curator?.address}
        />
      }
      label={<UserProfileLink address={curator?.address} />}
      columns={columns}
      mobileColumnIndex={[3, 4]}
      action={
        <CopyButton
          value={curator?.address}
          popOverLabel={t("misc.address-copied")}
          title={t("misc.copy-address")}
        />
      }
    />
  );
}