import { ReactNode, useEffect } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import CardBecomeCouncil from "components/card-become-council";
import { MiniTabs } from "components/mini-tabs";
import PageHero from "components/page-hero";

import { useAppState } from "contexts/app-state";

import { useNetwork } from "x-hooks/use-network";

interface CouncilLayoutProps {
  children?: ReactNode;
  totalReadyBounties: number;
  totalCurators: number;
  totalDistributed: number;
  totalLocked: number;
}

export default function CouncilLayout({ 
  children,
  totalReadyBounties,
  totalCurators,
  totalDistributed,
  totalLocked,
}: CouncilLayoutProps) {
  const { asPath, query, push } = useRouter();
  const { t } = useTranslation(["common", "council"]);

  const { state } = useAppState();
  const { getURLWithNetwork } = useNetwork();

  const networkTokenSymbol = state.Service?.network?.active?.networkToken?.symbol || t("misc.token");

  const infos = [
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

  const internalLinks = [
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

  useEffect(() => {
    if(!query?.type) handleUrlCurators("curators-list");
  }, [query?.type]);

  return (
    <div>
      <PageHero
        title={t("council:title")}
        subtitle={t("council:subtitle", {
          token: networkTokenSymbol,
        })}
        infos={infos}
      />
      <div className="container pt-3">
        <div className="d-flex justify-content-center">
          <MiniTabs items={internalLinks} />
        </div>
      </div>
      <div className="container p-footer">
        <div className="row justify-content-center">
          <div className="col-md-10 mt-2">
            {!state?.Service?.network?.active?.isCouncil && <CardBecomeCouncil />}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}