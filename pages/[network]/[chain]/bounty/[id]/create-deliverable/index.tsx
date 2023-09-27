import { dehydrate } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next/types";

import CreateDeliverablePage from "components/pages/create-deliverable/controller";

import { QueryKeys } from "helpers/query-keys";

import { getReactQueryClient } from "services/react-query";

import { getBountyData } from "x-hooks/api/bounty/get-bounty-data";

export default CreateDeliverablePage;

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const queryClient = getReactQueryClient();

  await queryClient.prefetchQuery(QueryKeys.bounty(query.id?.toString()), () => getBountyData(query));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(locale, [
        "common",
        "custom-network",
        "deliverable",
        "bounty",
        "connect-wallet-button",
      ])),
    },
  };
};
