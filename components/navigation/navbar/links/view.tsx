import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { Tooltip } from "components/common/tooltip/tooltip.view";
import InternalLink from "components/internal-link";
import ResponsiveWrapper from "components/responsive-wrapper";

import { NAVIGATION_LINKS } from "helpers/navigation-links";
import { isOnNetworkPath } from "helpers/network";

import { Link } from "types/utils";

import useMarketplace from "x-hooks/use-marketplace";

export default function NavBarLinks() {
  const { pathname } = useRouter();
  const { t } = useTranslation("common");

  const { getURLWithNetwork } = useMarketplace();

  const isOnNetwork = isOnNetworkPath(pathname);

  const { network, global, both } = NAVIGATION_LINKS;

  const links = ((isOnNetwork ? network.map(({ label, href }) => ({
    href: getURLWithNetwork(href),
    label
  })) : global) as Link[]).concat(both as Link[]);

  return(
    <ResponsiveWrapper
      xs={false}
      md={true}
    >
      <ul className="nav-links nav-gap">
        {links.map(({ href, label}) => 
          <li key={`nav-${label}`}>
            <Tooltip tip={t(`main-nav.tips.${label}`)}>
              <InternalLink
                href={href}
                label={label}
                nav
                uppercase
              />
            </Tooltip>
          </li>)}
      </ul>
    </ResponsiveWrapper>
  );
}