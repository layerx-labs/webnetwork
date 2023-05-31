import { useTranslation } from "next-i18next";

import ListActiveNetworks from "components/bounties/list-active-networks";
import ListRecentIssues from "components/bounties/list-recent-issues";
import ListIssues from "components/list-issues";
import PageHero from "components/page-hero";

import { BountyEffectsProvider } from "contexts/bounty-effects";

interface ExplorePageViewProps {
  numberOfNetworks: number;
  numberOfBounties: number;
  networkName?: string;
}

export default function ExplorePageView({
  numberOfNetworks,
  numberOfBounties,
  networkName,
}: ExplorePageViewProps) {
  const { t } = useTranslation(["common", "custom-network", "bounty"]);

  const infos = [
    {
      value: numberOfNetworks,
      label: t("custom-network:hero.number-of-networks")
    },
    {
      value: numberOfBounties,
      label: t("custom-network:hero.number-of-bounties")
    }
  ];

  const heroTitle = networkName ? 
    `${networkName.replace(/^\w/, c => c.toUpperCase())} Bounty Hall` : t("bounty:title-bounties");
  const heroSubTitle = networkName ? 
    `A collection of the most recent bounties of ${networkName} networks` : t("bounty:sub-title-bounties");

  return (
    <BountyEffectsProvider>
      <PageHero
        title={heroTitle}
        subtitle={heroSubTitle}
        infos={infos}
      />

      <ListActiveNetworks />

      <ListRecentIssues />

      <ListIssues variant="bounty-hall" />
    </BountyEffectsProvider>
  );
}