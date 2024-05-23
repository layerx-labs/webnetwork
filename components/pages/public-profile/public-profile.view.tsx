import AvatarOrIdenticon from "components/avatar-or-identicon";
import CustomContainer from "components/custom-container";
import If from "components/If";
import DeliverablesList from "components/lists/deliverables/deliverables-list.controller";
import NftsList from "components/lists/nfts/nfts-list.controller";
import ProposalsList from "components/lists/proposals/proposals-list.controller";
import TasksList from "components/lists/tasks/controller";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";


import {
  DeliverablePaginatedData,
  PaymentPaginatedData,
  ProposalPaginatedData,
  SearchBountiesPaginated
} from "types/api";
import {MiniTabsItem, TasksListItemVariant} from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

import {Github} from "../../../assets/icons/github";
import {Linkedin} from "../../../assets/icons/linkedin";
import {AnkrNftAsset} from "../../../types/ankr-nft-asset";
import {TaikaiPopView} from "../../lists/nfts/taikai-pop/taikai-pop.view";

interface PublicProfileViewProps {
  userAddress: string;
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
  payments?: PaymentPaginatedData;
  type?: string;
  socials?: {
    github: string;
    linkedIn: string;
  };
  about?: string;
  taikaiPops: AnkrNftAsset[],
  isTaikaiPoP: boolean,
}

export default function PublicProfileView({
                                            userAddress,
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
                                            payments,
                                            type = "won",
                                            socials = null,
                                            about = null,
                                            isTaikaiPoP,
                                            taikaiPops = [],
                                          }: PublicProfileViewProps) {
  const {isMobileView, isTabletView} = useBreakPoint();

  const isTabletOrMobile = isMobileView || isTabletView;
  const listItemVariant = ({
    won: "network",
    opened: "network",
    submissions: "submissions",
    proposals: "proposals",
    nfts: "nfts",
    pops: "pops"
  }[type] || "network") as TasksListItemVariant;

  return (
    <CustomContainer
      col="col-xs-12 col-xl-12"
      className="mt-4 pt-2 mt-lg-5 pt-lg-2"
    >
      <div className="row align-items-center mb-5">
        <div className="col-auto">
          <AvatarOrIdenticon
            address={userAddress}
            size={isTabletOrMobile ? 56 : "lg"}
            withBorder
          />
        </div>

        <div className="col">
          <div className="row mb-1">
            <h1 className="xl-semibold font-weight-medium text-white">
              {primaryText}
            </h1>
          </div>

          <If condition={!!secondaryText}>
            <div className="row mb-2">
              <h2 className="sm-regular font-weight-normal text-gray-300">
                {secondaryText}
              </h2>
            </div>
          </If>

          <div className="row mb-2">
            <div className="col sm-regular font-weight-normal text-gray-300">
              {socials?.github &&
                <a href={socials?.github} className="mr-2 text-decoration-none text-gray text-white-hover"
                   target="_blank">
                  <span className="mr-1"><Github/></span>
                  {socials?.github?.replace("https://github.com", "")}
                </a> || ""}

              {socials?.linkedIn &&
                <a href={socials?.linkedIn} className="text-decoration-none text-gray text-white-hover" target="_blank">
                  <span className="mr-1"><Linkedin/></span>
                  {socials?.linkedIn?.replace("https://linkedin.com", "")}
                </a> || ""}
            </div>
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
              payments={payments}
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