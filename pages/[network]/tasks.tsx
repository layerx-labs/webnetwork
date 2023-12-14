import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps} from "next/types";

import PageHero from "components/common/page-hero/view";
import CustomContainer from "components/custom-container";
import TasksList from "components/lists/tasks/controller";

import { emptyBountiesPaginated } from "helpers/api";

import { SearchBountiesPaginated } from "types/api";

import getNetworkOverviewData from "x-hooks/api/get-overview-data";
import { getBountiesListData } from "x-hooks/api/task";
import useMarketplace from "x-hooks/use-marketplace";
import {useTask} from "x-hooks/use-task";

interface BountiesPageProps {
  bounties: SearchBountiesPaginated;
  bountiesInProgress: number;
  bountiesClosed: number;
  lockedOnNetwork: number;
  protocolMembers: number;
}

export default function TasksPage({
  bounties,
  bountiesInProgress,
  bountiesClosed,
  lockedOnNetwork,
  protocolMembers,
}: BountiesPageProps) {
  useTask();
  const { t } = useTranslation(["common"]);
  
  const marketplace = useMarketplace();

  const infos = [
    {
      value: bountiesInProgress,
      label: t("heroes.in-progress")
    },
    {
      value: bountiesClosed,
      label: t("heroes.bounties-closed")
    },
    {
      value: lockedOnNetwork,
      label: t("heroes.in-network"),
      currency: t("$oracles", { token: marketplace?.active?.networkToken?.symbol || t("misc.$token") })
    },
    {
      value: protocolMembers,
      label: t("heroes.protocol-members")
    }
  ];

  return (
    <>
      <PageHero
        title={t("heroes.bounties.title")}
        subtitle={t("heroes.bounties.subtitle")}
        infos={infos}
      />

      <CustomContainer>
        <TasksList
          bounties={bounties}
          variant="network"
        />
      </CustomContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const [bounties, overview] = await Promise.all([
    getBountiesListData(query)
      .then(({ data }) => data)
      .catch(() => emptyBountiesPaginated),
    getNetworkOverviewData(query)
  ]);

  const { 
    open = 0, 
    draft = 0, 
    ready = 0, 
    proposal = 0, 
    closed = 0 
  } = overview.bounties;

  return {
    props: {
      bounties,
      bountiesInProgress: open + draft + ready + proposal,
      bountiesClosed: closed,
      lockedOnNetwork: overview.curators.tokensLocked,
      protocolMembers: overview.members,
      ...(await serverSideTranslations(locale, ["common", "bounty", "connect-wallet-button"]))
    }
  };
};
