import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import CreateNetworkBountyButtonView from "components/common/buttons/create-network-bounty/create-network-bounty.view";

export default function CreateNetworkBountyButton() {
  const { t } = useTranslation("common");
  const { pathname, push } = useRouter();

  const isOnNetwork = pathname?.includes("[network]");

  const actions = [
    { label: t("misc.bounty"), onClick: () => push("/create-bounty") },
    { label: t("misc.network"), onClick: () => push("/new-network") },
  ];

  return <CreateNetworkBountyButtonView
    isOnNetwork={isOnNetwork}
    actions={actions}
  />;
}