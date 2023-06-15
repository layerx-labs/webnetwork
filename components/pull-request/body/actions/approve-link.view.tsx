import { useTranslation } from "next-i18next";

import GithubLink from "components/github-link";

export default function ApproveLink({
  hrefPath,
  forcePath,
  color = "primary",
}: {
  hrefPath?: string;
  forcePath?: string;
  color?: string;
}) {
  const { t } = useTranslation(["pull-request"]);

  return (
    <GithubLink
      forcePath={hrefPath}
      hrefPath={forcePath}
      color={color}
    >
      {t("actions.approve")}
    </GithubLink>
  );
}
