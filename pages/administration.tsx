import { useState } from "react";

import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import getConfig from "next/config";

import { PointsSystemAdministration } 
  from "components/administration/points-system-administration/points-system-administration.controller";
import CustomContainer from "components/custom-container";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";

import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import { getReactQueryClient } from "services/react-query";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { useGetPointsBase } from "x-hooks/api/points";

const { publicRuntimeConfig, serverRuntimeConfig: { auth: { secret } } } = getConfig();

export default function AdministrationPage() {
  const [activeTab, setActiveTab] = useState("points-system");

  const tabs = {
    "points-system": <PointsSystemAdministration />
  };

  return (
    <CustomContainer className="mt-5">
      <ScrollableTabs
        tabs={[
          {
            label: "Points System",
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

  const queryClient = getReactQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QueryKeys.pointsBase(),
    queryFn: () => useGetPointsBase(),
  });

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
