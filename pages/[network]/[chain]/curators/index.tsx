import React from "react";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";

import BountiesList from "components/bounty/bounties-list/controller";
import CouncilLayout from "components/council-layout";
import CuratorsList from "components/curators-list";
import If from "components/If";

import { emptyBountiesPaginated } from "helpers/api";

import { SearchBountiesPaginated } from "types/api";

import getBountiesListData from "x-hooks/api/get-bounties-list-data";

interface PageCouncilProps {
  bounties: SearchBountiesPaginated;
}

export default function PageCouncil({
  bounties
}: PageCouncilProps) {
  const router = useRouter();
  const { t } = useTranslation(["council"]);
  
  const { type } = router.query;

  return (
    <CouncilLayout>
      <If 
        condition={type === "curators-list"}
        otherwise={
          <BountiesList
            key={type?.toString()}
            emptyMessage={t("council:empty")}
            bounties={bounties}
          />
        }
      >
        <CuratorsList 
          key={"curators-list"} 
          inView={type === "curators-list"}
        />
      </If>
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
