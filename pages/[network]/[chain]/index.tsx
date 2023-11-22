import { useEffect } from "react";

import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {GetServerSideProps} from "next/types";

import useMarketplace from "x-hooks/use-marketplace";

export default function Home() {
  const { replace, query } = useRouter();
  
  const { getURLWithNetwork } = useMarketplace();

  useEffect(() => {
    if(query?.network && query?.chain)
      replace(getURLWithNetwork(`/tasks`, {
        network: query?.network,
        chain: query?.chain
      }));
  }, []);

  return null;
}

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "bounty", "connect-wallet-button"]))
    }
  };
};
