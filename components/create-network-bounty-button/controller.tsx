import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

import CreateNetworkBountyButtonView from "components/create-network-bounty-button/view";

interface CreateNetworkBountyButtonProps {
  actionCallBack?: () => void;
  label?: string;
}

export default function CreateNetworkBountyButton({
  actionCallBack,
  label
}: CreateNetworkBountyButtonProps) {
  const { t } = useTranslation("common");
  const { pathname, push } = useRouter();

  const isOnNetwork = pathname?.includes("[network]");

  function onClick(url) {
    return () => {
      push(url);
      actionCallBack?.();
    }
  }

  const actions = [
    { label: t("misc.bounty"), onClick: onClick("/create-task") },
    { label: t("misc.network"), onClick: onClick("/new-marketplace") },
  ];

  return <CreateNetworkBountyButtonView
    isOnNetwork={isOnNetwork}
    actions={actions}
    label={label}
  />;
}