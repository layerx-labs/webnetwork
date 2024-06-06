import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import getConfig from "next/config";

import { PointsPage } from "components/pages/points/points-page.controller";

import { QueryKeys } from "helpers/query-keys";

import { getReactQueryClient } from "services/react-query";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { useGetPointsHistory } from "x-hooks/api/pages/profile/use-get-points-history";
import { useGetPointsBase } from "x-hooks/api/points";
import { useGetUserByAddress } from "x-hooks/api/user";

const { serverRuntimeConfig: { auth: { secret } } } = getConfig();

export default PointsPage;

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const token = await getToken({ req, secret: secret });
  const wallet = token?.address?.toString();

  const queryClient = getReactQueryClient();

  const pointsBase = await useGetPointsBase();

  queryClient.setQueryData(QueryKeys.pointsBase(), pointsBase);

  let totalPoints = 0;
  let history = [];

  if (wallet) {
    totalPoints = await useGetUserByAddress(wallet)
      .then(({ totalPoints }) => totalPoints)
      .catch(() => 0);

    history = await useGetPointsHistory(wallet);

    queryClient.setQueryData(QueryKeys.totalPointsOfUser(wallet), totalPoints);
    queryClient.setQueryData(QueryKeys.pointsEventsOfUser(wallet), history);
  }

  return {
    props: {
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "points",
        "connect-wallet-button",
      ])),
    },
  };
};