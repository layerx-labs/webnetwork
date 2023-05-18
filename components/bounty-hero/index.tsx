import {isMobile} from "react-device-detect";

import {useTranslation} from "next-i18next";
import { useRouter } from "next/router";

import Avatar from "components/avatar";
import Badge from "components/badge";
import CountInfo from "components/bounty-hero/count-info";
import BountyStatusInfo from "components/bounty-status-info";
import BountyTags from "components/bounty/bounty-tags";
import CustomContainer from "components/custom-container";
import DateLabel from "components/date-label";
import GithubInfo from "components/github-info";
import If from "components/If";
import PriceConversor from "components/price-conversor";
import Translation from "components/translation";

import {useAppState} from "contexts/app-state";

import {getIssueState} from "helpers/handleTypeIssue";
import {truncateAddress} from "helpers/truncate-address";

import BountySettings from "./bounty-settings";

export default function BountyHero({
  handleEditIssue,
  isEditIssue,
}: {
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
}) {
  const router = useRouter();
  const {t} = useTranslation(["bounty", "common"]);

  const {state} = useAppState();
  const { network } = router.query;

  function renderPriceConversor() {
    return (
      <PriceConversor
        currentValue={state.currentBounty?.data?.amount?.toFixed() || "0"}
        currency={state.currentBounty?.data?.transactionalToken?.symbol || t("common:misc.token")}
      />
    )
  }

  return (
    <div className="banner-shadow">
      <CustomContainer>
        <div className="d-flex flex-row">
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <div>       
                <span className="me-1 text-white-30 text-uppercase">{network} /</span>
                <span className="text-break">{state.currentBounty?.data?.githubId}</span>
              </div>
              <div className="">
                <BountySettings handleEditIssue={handleEditIssue} isEditIssue={isEditIssue} />
              </div>
            </div>

            <div className="d-flex justify-content-between border-top border-gray-850 mt-3">
              <div className="d-flex d-inline-flex align-items-center mt-3">
                <BountyStatusInfo
                  issueState={getIssueState({
                    state: state.currentBounty?.data?.state,
                    amount: state.currentBounty?.data?.amount,
                    fundingAmount: state.currentBounty?.data?.fundingAmount,
                  })}
                  fundedAmount={state.currentBounty?.data?.fundedAmount}
                />
                {!state.currentBounty?.data?.isKyc ? (
                  <Badge
                    className={`ms-3 d-flex py-1 px-2 bg-transparent border border-gray-700 text-gray-300`}
                    label={t("bounty:kyc.label")}
                  />
                ) : null}
              </div>
              <div>{renderPriceConversor()}</div>
            </div>
            <h5 className="mt-3 break-title">
              {state.currentBounty?.data?.title}
            </h5>
            <If condition={!!state.currentBounty?.data?.tags?.length}>
              <div className="mt-3 border-bottom border-gray-850 pb-4">
                <BountyTags
                      tags={state.currentBounty?.data?.tags}
                  />
              </div>
            </If>
            {!isMobile && (
              <>
                <div className="mt-3 pt-1 d-inline-flex align-items-center justify-content-md-start gap-20">

                  <div className="d-flex align-items-center">
                    <Avatar
                      className="me-2"
                      userLogin={state.currentBounty?.data?.creatorGithub}
                    />{" "}
                    <GithubInfo
                      parent="hero"
                      variant="user"
                      label={state.currentBounty?.data?.creatorGithub ?
                        ["@", state.currentBounty?.data?.creatorGithub].join("")
                        :
                        truncateAddress(state.currentBounty?.data?.creatorAddress)
                      }
                    />
                  </div>

                  <span className="caption-small">
                    <If condition={!!state.currentBounty?.data?.repository}>
                      <GithubInfo
                        parent="list"
                        variant="repository"
                        label={state.currentBounty?.data?.repository?.githubPath}
                      />
                    </If>
                  </span>

                  <span className="caption-small text-light-gray text-uppercase">
                    <Translation label={"branch"} />
                    <span className="text-primary">:{state.currentBounty?.data?.branch}</span>
                  </span>
                </div>

                <div className="mt-3 pt-1 d-inline-flex align-items-center justify-content-md-start gap-20">
                  <CountInfo 
                    type="working"
                    count={state.currentBounty?.data?.working?.length}
                  />

                  <CountInfo 
                    type="pull-requests"
                    count={state.currentBounty?.data?.pullRequests?.length}
                  />

                  <CountInfo 
                    type="proposals"
                    count={state.currentBounty?.data?.mergeProposals?.length}
                  />

                  <If condition={!!state.currentBounty?.data?.createdAt}>
                    <DateLabel
                      date={state.currentBounty?.data?.createdAt}
                      className="text-white"
                      />
                  </If>
                </div>

              </>
            )}
          </div>
        </div>
      </CustomContainer>
    </div>
  );
}
