

import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps} from "next/types";

import { ExplorePage, getExplorePageData } from "components/pages/explore/controller";

export default ExplorePage;

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const data = await getExplorePageData(query);

  return {
    props: {
      ...data,
      ...(await serverSideTranslations(locale, ["common", "custom-network", "bounty", "connect-wallet-button"]))
    }
  };
};
