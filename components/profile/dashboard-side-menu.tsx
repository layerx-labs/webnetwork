import { useTranslation } from "next-i18next";

import StarIcon from "assets/icons/star-icon";

import DashboardLinks from "components/profile/dashboard-links";
import ResponsiveWrapper from "components/responsive-wrapper";

import { LinkProps } from "types/components";

export default function DashboardSideMenu() {
  const { t } = useTranslation("profile");

  const extraLinks: LinkProps[] = [
    { label: t("my-points"), href: "my-points", icon: StarIcon }
  ];

  return (
    <ResponsiveWrapper
      xl={true}
      xs={false}
      className="col-2 bg-gray-950"
    >
      <div className="ml-2 pt-4 w-100">
        <DashboardLinks
          extraLinks={extraLinks}
        />
      </div>
    </ResponsiveWrapper>
  );
}
