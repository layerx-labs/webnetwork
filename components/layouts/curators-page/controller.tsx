import { ReactNode } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import CuratorsPageLayoutView from "components/layouts/curators-page/view";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";

interface CuratorsLayoutProps {
  children?: ReactNode;
  totalReadyBounties: number;
  totalCurators: number;
  totalDistributed: number;
  totalLocked: number;
}

export default function CuratorsPageLayout({ 
  children,
  totalReadyBounties,
  totalCurators,
  totalDistributed,
  totalLocked,
}: CuratorsLayoutProps) {
  const { asPath, query, push } = useRouter();
  const { t } = useTranslation(["common", "council"]);

  const { currentUser } = useUserStore();
  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();

  const networkTokenSymbol = activeMarketplace?.networkToken?.symbol || t("misc.token");
  const isCouncil = !!currentUser?.isCouncil;
  const heroInfos = [
    {
      value: totalReadyBounties,
      label: t("council:ready-bountys"),
    },
    {
      value: totalCurators,
      label: t("council:council-members"),
    },
    {
      value: totalDistributed,
      label: t("council:distributed-developers"),
      currency: networkTokenSymbol,
    },
    {
      value: totalLocked,
      label: t("heroes.in-network"),
      currency: networkTokenSymbol,
    },
  ];

  function handleUrlCurators (type: string) {
    return push(getURLWithNetwork("/curators", {
      type
    }), asPath, { shallow: false, scroll: false });
  }

  const tabsItems = [
    {
      onClick: () => handleUrlCurators("curators-list"),
      label: t("council:council-list"),
      active: query?.type === "curators-list" || !query?.type
    },
    {
      onClick: () => handleUrlCurators("ready-to-propose"),
      label: t("council:ready-to-propose"),
      active: query?.type === "ready-to-propose" 
    },
    {
      onClick: () => handleUrlCurators("ready-to-dispute"),
      label: t("council:ready-to-dispute"),
      active: query?.type === "ready-to-dispute"
    },
    {
      onClick: () => handleUrlCurators("ready-to-close"),
      label: t("council:ready-to-close"),
      active: query?.type === "ready-to-close"
    }
  ]

  return (
    <CuratorsPageLayoutView
      networkTokenSymbol={networkTokenSymbol}
      heroInfos={heroInfos}
      isCouncil={isCouncil}
      tabsItems={tabsItems}
    >
      {children}
    </CuratorsPageLayoutView>
  );
}