import { UrlObject } from "url";

import LogoPlaceholder from "assets/icons/logo-placeholder";

import InternalLink from "components/internal-link";
import ResponsiveWrapper from "components/responsive-wrapper";

interface BrandLogoProps {
  href: string | UrlObject;
  logoUrl: string;
  showDefaultBepro?: boolean;
}

export default function BrandLogo({
  href,
  logoUrl,
  showDefaultBepro
} : BrandLogoProps) {
  const defaultLogo = `/images/Bepro_Logo_Light.svg`;

  const icon =
    showDefaultBepro || logoUrl ? (
      <>
        <ResponsiveWrapper xs={false} xl={true}>
          <img src={showDefaultBepro ? defaultLogo : logoUrl} height={32} />
        </ResponsiveWrapper>
        <ResponsiveWrapper xs={true} xl={false}>
          <img
            src={showDefaultBepro ? defaultLogo : logoUrl}
            height={32}
            className="mw-45-vw"
          />
        </ResponsiveWrapper>
      </>
    ) : (
      <LogoPlaceholder />
    );

  return(
    <InternalLink
      href={href}
      icon={icon}
      className="brand"
      nav
      active
      brand
    />
  );
}