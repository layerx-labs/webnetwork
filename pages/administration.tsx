import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import getConfig from "next/config";

import { lowerCaseCompare } from "helpers/string";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

const { publicRuntimeConfig, serverRuntimeConfig: { auth: { secret } } } = getConfig();

export default function AdministrationPage() {
  return (
    <div className="container">
      
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const token = await getToken({ req, secret: secret });

  if (!token?.address || !lowerCaseCompare(token?.address?.toString(), publicRuntimeConfig?.adminWallet))
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
      props: {},
    };

  return {
    props: {
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "connect-wallet-button",
        "custom-network"
      ]))
    }
  };
};
