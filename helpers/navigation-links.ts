import {ReactElement, SVGProps} from 'react';

import {TFunction} from 'next-i18next';

import BountiesIcon from "assets/icons/bounties-icon";
import CustomNetworkIcon from "assets/icons/custom-network-icon";
import DeliverableIcon from 'assets/icons/deliverable-icon';
import PaymentsIcon from "assets/icons/payments-icon";
import ProfileIcon from "assets/icons/profile-icon";
import ProposalsIcon from "assets/icons/proposals-icon";
import VotingPowerIcon from "assets/icons/voting-power-icon";
import WalletIcon from "assets/icons/wallet-icon";

import {ProfilePages} from "interfaces/utils";

import BellIcon from "../assets/icons/bell-icon";

export const NAVIGATION_LINKS = {
  network: [
    { label: "tasks", href: "/tasks" },
    { label: "curators", href: "/curators" },
  ],
  global: [
    { label: "marketplaces", href: "/marketplaces" },
    { label: "leaderboard", href: "/leaderboard" },
  ],
  both: [
    { label: "explore", href: "/explore" },
  ]
}

export function getProfileLinks(translation: TFunction) {
  const PROFILE_LINKS: {
    label: string;
    href?: ProfilePages
    icon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
  }[] = [
    { label: translation("common:main-nav.nav-avatar.profile"), icon: ProfileIcon },
    { label: translation("common:main-nav.nav-avatar.wallet") , href: 'wallet', icon: WalletIcon },
    { label: translation("common:main-nav.nav-avatar.voting-power") , href: 'voting-power', icon: VotingPowerIcon},
    { label: translation("common:main-nav.nav-avatar.payments") , href: 'payments', icon: PaymentsIcon},
    { label: translation("common:main-nav.nav-avatar.bounties") , href: 'tasks', icon:BountiesIcon},
    { label: translation("common:main-nav.nav-avatar.deliverables") , href: 'deliverables', icon:DeliverableIcon},
    { label: translation("common:main-nav.nav-avatar.proposals") , href: 'proposals', icon:ProposalsIcon},
    { label: translation("common:main-nav.nav-avatar.subscriptions") , href: 'subscriptions', icon:BellIcon},
    { label: translation("common:main-nav.nav-avatar.my-network") , href: 'my-marketplace', icon:CustomNetworkIcon},
  ]

  return PROFILE_LINKS;
}
