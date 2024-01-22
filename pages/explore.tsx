import {GetServerSideProps} from "next/types";

import ExplorePage from "components/pages/explore/controller";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import getExplorePageData from "x-hooks/api/get-explore-page-data";

export default ExplorePage;

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const data = await getExplorePageData(query);
  console.log('NODE_ENV', process.env.NODE_ENV)
  return {
    props: {
      ...data,
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "custom-network",
        "bounty",
        "connect-wallet-button"
      ]))
    }
  };
};
