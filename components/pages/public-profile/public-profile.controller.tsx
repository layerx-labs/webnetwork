import React from "react";

import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

import PublicProfileView from "components/pages/public-profile/public-profile.view";

import {truncateAddress} from "helpers/truncate-address";

import {User} from "interfaces/api";


import {
  DeliverablePaginatedData,
  PaymentPaginatedData,
  ProposalPaginatedData,
  SearchBountiesPaginated
} from "types/api";

import {AnkrNftAsset} from "../../../types/ankr-nft-asset";

interface PublicProfilePageProps {
  user: User;
  tasks?: SearchBountiesPaginated;
  deliverables?: DeliverablePaginatedData;
  proposals?: ProposalPaginatedData;
  payments?: PaymentPaginatedData;
  pops?: AnkrNftAsset[]
}
export default function PublicProfilePage ({
  user,
  tasks,
  deliverables,
  proposals,
  payments,
  pops,
}: PublicProfilePageProps) {
  const { t } = useTranslation("profile");
  const { query, pathname, asPath, push } = useRouter();

  const type = query?.type?.toString() || "won";
  const isTaskList = ["won", "opened"].includes(type);
  const isDeliverableList = type === "submissions";
  const isProposalsList = type === "proposals";
  const isNftsList = type === "nfts";
  const isTaikaiPops = type === "taikai-pop";
  const hasHandle = !!user?.handle;
  const truncatedAddress = truncateAddress(user?.address || "");
  const [primaryText, secondaryText] = hasHandle ? [user?.handle, truncatedAddress] : [truncatedAddress, user?.handle];

  const getTab = (label: string, key: string) => ({
    label,
    active: type === key,
    onClick: () => push({
      pathname: pathname,
      query: {
        type: key
      }
    }, asPath)
  });

  const tabs = [
    getTab(t("tasks-won"), "won"),
    getTab(t("deliverables"), "submissions"),
    getTab(t("proposals"), "proposals"),
    getTab(t("tasks-opened"), "opened"),
    getTab(t("nfts"), "nfts"),
    getTab(t("taikai-pop"), "taikai-pop"),
  ];

  return (
    <PublicProfileView
      userAddress={user?.address}
      primaryText={primaryText}
      secondaryText={secondaryText}
      tabs={tabs}
      isTaskList={isTaskList}
      isDeliverableList={isDeliverableList}
      isProposalsList={isProposalsList}
      isNftsList={isNftsList}
      isTaikaiPoP={isTaikaiPops}
      tasks={tasks}
      deliverables={deliverables}
      proposals={proposals}
      payments={payments}
      type={type}
      socials={{
        github: user?.githubLink,
        linkedIn: user?.linkedInLink
      }}
      about={user?.about}
      taikaiPops={pops}
    />
  );
}