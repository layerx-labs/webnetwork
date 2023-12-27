import { dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next/types";

import CreateDeliverablePage from "components/pages/create-deliverable/controller";

import {QueryKeys} from "helpers/query-keys";

import { getReactQueryClient } from "services/react-query";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { getBountyData } from "x-hooks/api/task/get-bounty-data";

export default CreateDeliverablePage;

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const queryClient = getReactQueryClient();

  await queryClient.prefetchQuery(QueryKeys.bounty(query.id?.toString()), () => getBountyData(query));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "custom-network",
        "deliverable",
        "bounty",
        "connect-wallet-button",
      ])),
    },
  };
};
