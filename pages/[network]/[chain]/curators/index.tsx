import React from "react";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import CouncilLayout from "components/council-layout";
import CuratorsList from "components/curators-list";
import ListIssues from "components/list-issues";

import { SearchBountiesPaginated } from "types/api";

import getBountiesListData from "x-hooks/api/get-bounties-list-data";

interface PageCouncilProps {
  bounties: SearchBountiesPaginated;
}

export default function PageCouncil({
  bounties
}: PageCouncilProps) {
  const { t } = useTranslation(["council"]);
  const router = useRouter();
  const { type } = router.query;

  const types = {
    "curators-list": <CuratorsList key={"curators-list"} inView={type === 'curators-list'} />,
    "ready-to-close": (
      <ListIssues
        key={"ready-to-close"}
        filterState="proposal"
        emptyMessage={t("council:empty")}
        disputableFilter="merge"
        inView={type === 'ready-to-close'}
        bounties={bounties}
      />
    ),
    "ready-to-dispute": (
      <ListIssues
        key={"ready-to-dispute"}
        filterState="proposal"
        emptyMessage={t("council:empty")}
        disputableFilter="dispute"
        inView={type === 'ready-to-dispute'}
        bounties={bounties}
      />
    ),
    "ready-to-propose": (
      <ListIssues
        key={"ready-to-propose"}
        filterState="ready"
        emptyMessage={t("council:empty")}
        inView={!type || type === 'ready-to-propose'}
        bounties={bounties}
      />
    ),
  };

  return (
    <CouncilLayout>
      {console.log("pagecouncil", bounties)}
      {types[type?.toString()]}
    </CouncilLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { type } = query;

  const bounties = {};

  if (type && type !== "curators-list") {
    const state = {
      "ready-to-propose": "proposable",
      "ready-to-dispute": "disputable",
      "ready-to-close": "mergeable",
    }[type.toString()];

    const bountiesPaginated = await getBountiesListData({ ...query, state })
      .then(({ data }) => data)
      .catch(() => ({ count: 0, rows: [], currentPage: 1, pages: 1 }));

    Object.assign(bounties, bountiesPaginated);
  }

  return {
    props: {
      bounties,
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "council",
        "connect-wallet-button",
      ])),
    },
  };
};
