import { UrlObject } from "url";

import LogoPlaceholder from "assets/icons/logo-placeholder";

import InternalLink from "components/internal-link";
import { ResponsiveEle } from "components/responsive-wrapper";

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
      <ResponsiveEle 
        mobileView={
          <img
            src={showDefaultBepro ? defaultLogo : logoUrl}
            height={29}
            className="mw-45-vw"
          />
        }
        tabletView={
          <img src={showDefaultBepro ? defaultLogo : logoUrl} height={29} />
        }
      />
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