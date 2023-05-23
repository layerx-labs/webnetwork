import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import PlusIcon from "assets/icons/plus-icon";

import InternalLink from "components/internal-link";
import MultiActionButton from "components/multi-action-button";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

export default function CreateNetworkBountyButton() {
  const { t } = useTranslation();
  const { pathname, push } = useRouter();

  const isOnNetwork = pathname?.includes("[network]");

  return(
    <ReadOnlyButtonWrapper>
    {
      isOnNetwork ?
        <InternalLink
          href={"/create-bounty"}
          icon={<PlusIcon />}
          label={t("main-nav.new-bounty") as string}
          iconBefore
          uppercase
        /> :
        <MultiActionButton
          label="Create"
          className="read-only-button w-100"
          icon={<PlusIcon />}
          actions={[
            { label: "Bounty", onClick: () => push("/create-bounty") },
            { label: "Network", onClick: () => push("/new-network") },
          ]}
        />
    }
  </ReadOnlyButtonWrapper>
  );
}