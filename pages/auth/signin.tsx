import {useEffect} from "react";

import {useRouter} from "next/router";
import {GetServerSideProps} from "next/types";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    if (router?.query?.error)
      router.replace(sessionStorage.getItem("lastUrlBeforeGithubConnect") || "/");
  }, [router?.query?.error]);

  return <></>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    props: {
      ...(await customServerSideTranslations(req, locale, ["common", "bounty", "connect-wallet-button"]))
    }
  };
};
