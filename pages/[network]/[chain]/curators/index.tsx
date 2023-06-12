import React from "react";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import BountiesList from "components/bounty/bounties-list/controller";
import CouncilLayout from "components/council-layout";
import CuratorsList from "components/curators-list";

import { emptyBountiesPaginated } from "helpers/api";

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
      <BountiesList
        key={"ready-to-close"}
        emptyMessage={t("council:empty")}
        inView={type === 'ready-to-close'}
        bounties={bounties}
      />
    ),
    "ready-to-dispute": (
      <BountiesList
        key={"ready-to-dispute"}
        emptyMessage={t("council:empty")}
        inView={type === 'ready-to-dispute'}
        bounties={bounties}
      />
    ),
    "ready-to-propose": (
      <BountiesList
        key={"ready-to-propose"}
        emptyMessage={t("council:empty")}
        inView={!type || type === 'ready-to-propose'}
        bounties={bounties}
      />
    ),
  };

  return (
    <CouncilLayout>
      {types[type?.toString()]}
    </CouncilLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { type } = query;

  const state = {
    "ready-to-propose": "proposable",
    "ready-to-dispute": "disputable",
    "ready-to-close": "mergeable",
  }[type?.toString()];

  const getBountiesList = (filters) => getBountiesListData(filters)
    .then(({ data }) => data)
    .catch(() => emptyBountiesPaginated);

  const [bounties, readyBounties] = await Promise.all([
    state ? getBountiesList({ ...query, state }) : emptyBountiesPaginated,
    getBountiesList({ state: "ready" }).then(({ count }) => count)
  ]);
    
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
