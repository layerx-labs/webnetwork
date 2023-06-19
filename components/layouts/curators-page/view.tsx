import { ReactNode } from "react";

import { useTranslation } from "next-i18next";

import BecomeCuratorCard from "components/cards/become-curator/controller";
import MiniTabs from "components/common/mini-tabs/view";
import PageHero from "components/common/page-hero/view";

import { HeroInfo, MiniTabsItem } from "types/components";

interface CuratorsPageLayoutViewProps {
  children?: ReactNode;
  networkTokenSymbol: string;
  heroInfos: HeroInfo[];
  tabsItems: MiniTabsItem[];
  isCouncil?: boolean;
}

export default function CuratorsPageLayoutView({ 
  children,
  networkTokenSymbol,
  heroInfos,
  isCouncil,
  tabsItems,
}: CuratorsPageLayoutViewProps) {
  const { t } = useTranslation(["common", "council"]);

  return (
    <div>
      <PageHero
        title={t("council:title")}
        subtitle={t("council:subtitle", { token: networkTokenSymbol })}
        infos={heroInfos}
      />

      <div className="container pt-3">
        <div className="d-flex justify-content-center">
          <MiniTabs items={tabsItems} />
        </div>
      </div>

      <div className="container p-footer">
        <div className="row justify-content-center">
          <div className="col-md-10 mt-2">
            <BecomeCuratorCard isCouncil={isCouncil} />
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}