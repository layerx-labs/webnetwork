import clsx from "clsx";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import { getProfileLinks } from "helpers/navigation-links";

import { LinkProps } from "types/components";

interface DashboardLinksProps {
  onClick?: () => void;
}

export default function DashboardLinks({
  onClick
}: DashboardLinksProps) {
  const { query, asPath } = useRouter();
  const { t } = useTranslation("common");

  const cleanQuery = { ...query, networkName: null, networkChain: null };

  const getHref = (href = "") => `/dashboard/${href}`;
  const getUrl = () => ({ pathname: "/dashboard/[[...dashboardPage]]", query: cleanQuery });
  const isActive = href => asPath.endsWith(`/dashboard${href ? `/${href}` : ""}`);

  const ProfileLink = ({ label, href, icon: Icon }: LinkProps) => (
    <li className="mb-2" key={label}>
      <Link href={getUrl()} as={getHref(href)} passHref>
        <a
          className={clsx([
            "d-flex flex-row align-items-center gap-2 text-decoration-none",
            "text-gray-150 border-radius-1 p-2 text-white-hover",
            isActive(href) ? "profile-side-link-active" : ""
          ])}
          data-testid={label}
          onClick={onClick}
        >
          <Icon data-testid={label} />
          <span>{label}</span>
        </a>
      </Link>
    </li>
    );

  return(
    <ul>
      {getProfileLinks(t).map(ProfileLink)}
    </ul>
  );
}