import {useTranslation} from "next-i18next";

import {Github} from "assets/icons/github";
import {Linkedin} from "assets/icons/linkedin";
import {XCom} from "assets/icons/x-com";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import CustomContainer from "components/custom-container";
import If from "components/If";
import DeliverablesList from "components/lists/deliverables/deliverables-list.controller";
import NftsList from "components/lists/nfts/nfts-list.controller";
import ProposalsList from "components/lists/proposals/proposals-list.controller";
import TasksList from "components/lists/tasks/controller";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";

import {AnkrNftAsset} from "types/ankr-nft-asset";
import {
  DeliverablePaginatedData,
  ProposalPaginatedData,
  SearchBountiesPaginated
} from "types/api";
import {MiniTabsItem, TasksListItemVariant} from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

import CopyButton from "../../common/buttons/copy/controller";
import {TaikaiPopView} from "../../lists/nfts/taikai-pop/taikai-pop.view";

interface PublicProfileViewProps {
  userAddress: string;
  avatar?: string;
  primaryText: string;
  secondaryText?: string;
  tabs: MiniTabsItem[];
  isTaskList?: boolean;
  isDeliverableList?: boolean;
  isProposalsList?: boolean;
  isNftsList?: boolean;
  tasks?: SearchBountiesPaginated;
  deliverables?: DeliverablePaginatedData;
  proposals?: ProposalPaginatedData;
  nfts?: SearchBountiesPaginated;
  type?: string;
  socials?: {
    github: string;
    linkedIn: string;
    twitter: string;
  };
  about?: string;
  taikaiPops: AnkrNftAsset[],
  isTaikaiPoP: boolean,
}

export default function PublicProfileView({
                                            userAddress,
                                            avatar,
                                            primaryText,
                                            secondaryText,
                                            tabs,
                                            isTaskList,
                                            isDeliverableList,
                                            isProposalsList,
                                            isNftsList,
                                            tasks,
                                            deliverables,
                                            proposals,
                                            nfts,
                                            type = "won",
                                            socials = null,
                                            about = null,
                                            isTaikaiPoP,
                                            taikaiPops = [],
                                          }: PublicProfileViewProps) {
  const { isMobileView } = useBreakPoint();

  const {t} = useTranslation("common");

  const listItemVariant = ({
    won: "network",
    opened: "network",
    submissions: "submissions",
    proposals: "proposals",
    nfts: "nfts",
    pops: "pops"
  }[type] || "network") as TasksListItemVariant;

  const socialEle = [
    [socials?.github?.replace("https://github.com/",""), socials?.github, <Github/>],
    [socials?.linkedIn?.replace("https://linkedin.com/in/", ""), socials?.linkedIn, <Linkedin/>],
    [socials?.twitter?.replace("https://x.com/", ""), socials?.twitter, <XCom/>],
  ]

  return (
    <CustomContainer
      col="col-xs-12 col-xl-12"
      className="mt-4 pt-2 mt-lg-5 pt-lg-2"
    >
      <div className="row align-items-center mb-5">
        <div className="col-12 col-sm-auto mb-2 mb-sm-0">
          <AvatarOrIdenticon
            user={{ address: userAddress, avatar }}
            size={isMobileView ? "lg" : "xl"}
            withBorder
          />
        </div>

        <div className="col">
          <div className="row mb-2">
            <h1 className="xl-semibold font-weight-medium text-white">
              {primaryText}
            </h1>
          </div>

          <If condition={!!secondaryText}>
            <div className="row mb-3">
              <h2 className="sm-regular font-weight-normal text-gray-300 d-flex align-items-center">
                <div>{secondaryText}</div>
                <div className="ml-1">
                  <CopyButton value={userAddress}
                              title={userAddress}
                              popOverLabel={t('misc.address-copied')}/>
                </div>
              </h2>
            </div>
          </If>

          <div className="row mb-2 gy-3 gx-2">
            {
              socialEle.map(([value, link, icon], i) =>
                link && 
              <div className="col-12 col-sm-auto sm-regular font-weight-normal text-gray-300">
                <a href={link as string} key={i}
                            className="mr-2 text-decoration-none text-gray text-white-hover"
                            target="_blank">
                  <span className="mr-1">{icon}</span>
                  {value}
                </a> </div> || "")
            }
          </div>

          <div className="row">
            <div className="col sm-regular font-weight-normal text-gray-300">
              {about}
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 pb-1">
        <div className="col">
          <ScrollableTabs
            tabs={tabs}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <If condition={isTaskList}>
            <TasksList
              bounties={tasks}
              variant="profile"
              itemVariant={listItemVariant}
              hideTitle
            />
          </If>

          <If condition={isDeliverableList}>
            <DeliverablesList
              deliverables={deliverables}
            />
          </If>

          <If condition={isProposalsList}>
            <ProposalsList
              proposals={proposals}
            />
          </If>

          <If condition={isNftsList}>
            <NftsList
              nfts={nfts}
            />
          </If>

          <If condition={isTaikaiPoP}>
            <TaikaiPopView assets={taikaiPops} />
          </If>

        </div>
      </div>
    </CustomContainer>
  );
}