import { useTranslation } from "next-i18next";
import Link from "next/link";

import { ContextualSpan } from "components/contextual-span";

interface DeliverableInfoCardViewProps {
  votingPowerHref: string;
  votingPowerAlias: string;
}

export default function DeliverableInfoCardView({
  votingPowerHref,
  votingPowerAlias,
}: DeliverableInfoCardViewProps) {
  const { t } = useTranslation("deliverable");

  return (
    <ContextualSpan isAlert isDismissable context='info' className="bg-info-10 mb-2">
    {t("deliverable:infos.curators")}
      <Link href={votingPowerHref} as={votingPowerAlias}>
        <a className="text-primary">
          {t("deliverable:infos.get-voting-power")}
        </a>
      </Link>
    </ContextualSpan>
  );
}
