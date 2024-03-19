import {GetServerSideProps} from "next/types";

import ExplorePage from "components/pages/explore/controller";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import getExplorePageData from "x-hooks/api/get-explore-page-data";

import isSpamValue from "../../helpers/is-spam-value";

export default ExplorePage;

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {

  if (query?.network && isSpamValue(query.network)) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
      }
    } as any;
  }

  return {
    props: {
      ...(await getExplorePageData(query)),
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "custom-network",
        "bounty",
        "connect-wallet-button"
      ]))
    }
  };
};
