import { useState } from "react";

import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";

import { PointsSystemAdministration } 
  from "components/administration/points-system-administration/points-system-administration.controller";
import CustomContainer from "components/custom-container";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";

import { lowerCaseCompare } from "helpers/string";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

const { publicRuntimeConfig, serverRuntimeConfig: { auth: { secret } } } = getConfig();

export default function AdministrationPage() {
  const { t } = useTranslation("administration");

  const [activeTab, setActiveTab] = useState("points-system");

  const tabs = {
    "points-system": <PointsSystemAdministration />
  };

  return (
    <CustomContainer className="mt-5">
      <ScrollableTabs
        tabs={[
          {
            label: t("points-system.title"),
            active: activeTab === "points-system",
            onClick: () => setActiveTab("points-system"),
          }
        ]}
      />

      {tabs[activeTab]}
    </CustomContainer>
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
        "custom-network",
        "administration"
      ]))
    }
  };
};
