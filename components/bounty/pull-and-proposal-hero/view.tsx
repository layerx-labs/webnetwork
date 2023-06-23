import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import ArrowLeft from "assets/icons/arrow-left";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import PriceConversor from "components/bounty/bounty-hero/price-conversor/controller";
import Button from "components/button";
import CustomContainer from "components/custom-container";
import DateLabel from "components/date-label";
import GithubInfo from "components/github-info";

import { truncateAddress } from "helpers/truncate-address";

import { pullRequest } from "interfaces/issue-data";
import { Proposal } from "interfaces/proposal";

interface PullAndProposalHeroPRops {
  proposal?: Proposal;
  pullRequest?: pullRequest;
}

export default function PullAndProposalHero({
  proposal,
  pullRequest,
}: PullAndProposalHeroPRops) {
  const router = useRouter();
  const { t } = useTranslation("common");

  const { contractId, githubLogin, createdAt, issue } =
    proposal || pullRequest || {};
  const creatorAddress = proposal?.creator || pullRequest?.userAddress;

  return (
    <CustomContainer className="p-3">
      <div className="row align-items-center">
        <div className="col-auto">
          <Button className="rounded-circle p-1 text-white not-svg" outline>
            <ArrowLeft
              width={10}
              height={10}
            />
          </Button>
        </div>

        <div className="col px-0">
          <span className="me-2 text-gray-500 caption-medium font-weight-medium">
            #{issue?.githubId}
          </span>
          <span className="text-white caption-medium font-weight-medium text-capitalize">{issue?.title}</span>
        </div>
      </div>

      <div className="row">
        <div className="col-10 row">
          <div className="mt-3 pt-1 d-inline-flex align-items-center justify-content-md-start gap-2">
            <h4>{t("proposal:title")}</h4>
            <h4 className="text-white-40">#{+(contractId || 0) + 1}</h4>
          </div>

          <div className="mt-3 pt-1 d-inline-flex align-items-center justify-content-md-start gap-2">
            <div className="d-flex align-items-center">
              <div className="mr-1">
                <AvatarOrIdenticon
                  user={githubLogin}
                  address={creatorAddress}
                  size="sm"
                />
              </div>

              <GithubInfo
                parent="hero"
                variant="user"
                label={
                  githubLogin
                    ? `@${githubLogin}`
                    : truncateAddress(creatorAddress)
                }
              />
            </div>

            {createdAt && <DateLabel date={createdAt} className="text-white" />}
          </div>
        </div>

        <div className="col-2 d-flex align-items-center justify-content-center">
          <PriceConversor
            currentValue={BigNumber(issue?.amount || 0)}
            currency={issue?.transactionalToken?.symbol || t("misc.token")}
          />
        </div>
      </div>
    </CustomContainer>
  );
}
