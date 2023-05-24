import { useEffect, useReducer } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import PlusIcon from "assets/icons/plus-icon";

import LoadingList from "components/bounties/loading-list";
import ContractButton from "components/contract-button";
import CustomContainer from "components/custom-container";
import HorizontalList from "components/horizontal-list";
import IssueListItem from "components/issue-list-item";
import NothingFound from "components/nothing-found";

import { IssueBigNumberData } from "interfaces/issue-data";

import useApi from "x-hooks/use-api";
import { useNetwork } from "x-hooks/use-network";

interface BountiesStates {
  openBounties?: IssueBigNumberData[];
  loadingOpenBounties?: boolean;
  fundingBounties?: IssueBigNumberData[];
  loadingFundingBounties?: boolean;
}

export default function ListRecentIssues() {
  const { t } = useTranslation(["bounty"]);
  const { push } = useRouter();

  const [bounties, updateBounties] = useReducer((prev: BountiesStates, next: Partial<BountiesStates>) => {
    return { ...prev, ...next };
  },
                                                {
      openBounties: [],
      loadingOpenBounties: false,
      loadingFundingBounties: false,
      fundingBounties: [],
                                                });

  const { networkName } = useNetwork();
  const { searchRecentIssues } = useApi();

  async function handleSearchRecentIssues(type: "open" | "funding") {
    const isOpen = type === "open";
    const setLoading = (state: boolean) =>
      updateBounties(isOpen
          ? { loadingOpenBounties: state }
          : { loadingFundingBounties: state });
    const setBounties = (data: IssueBigNumberData[]) =>
      updateBounties(isOpen ? { openBounties: data } : { fundingBounties: data });

    setLoading(true);
    searchRecentIssues({ networkName, state: type })
      .then(setBounties)
      .catch((err) => {
        console.debug(err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    handleSearchRecentIssues("open");
    handleSearchRecentIssues("funding");
  }, [networkName]);

  function renderNothingFound(type: "open" | "funding") {
    const isOpen = type === "open";

    const goToPage = 
      () => type === "open" ? push("/create-bounty") : push("/create-bounty?type=funding", "/create-bounty", )

    return (
      <div className="col-12 col-sm-6 col-md">
        <NothingFound
          description={
          <>
            <span className="d-none d-md-flex justify-content-center">
              {isOpen ? t("not-found-bounty") : t("not-found-funding")}
            </span>

            <span className="d-flex d-md-none text-truncate">
              {isOpen ? t("not-found-bounty") : t("not-found-funding")}
            </span>
          </>
        }
          type="dashed"
        >
          <div className="d-flex justify-content-center">
            <ContractButton
              onClick={goToPage}
              textClass="text-white-50"
              className="read-only-button bg-gray-850 border-gray-850 mt-3 text-nowrap"
            >
              <PlusIcon className="text-gray-400" />
              <span>{isOpen ? t("create-bounty") : t("create-funding")}</span>
            </ContractButton>
          </div>
        </NothingFound>
      </div>
    );
  }

  function renderBounties(type: "open" | "funding") {
    const isOpen = type === "open";

    const currentBounties = isOpen
      ? bounties.openBounties
      : bounties.fundingBounties;
    const loadingState = isOpen
      ? bounties.loadingOpenBounties
      : bounties.loadingFundingBounties;

    return (
      <CustomContainer>
        <div className="d-flex mt-2 p-1">
          <h4 className="mt-1">
            {isOpen ? t("recent-bounties") : t("recent-funding")}
          </h4>
        </div>

        <LoadingList loading={loadingState} />

        <div className="mb-3 mt-1">
          <HorizontalList className="gap-3">
          {currentBounties &&
            currentBounties?.map((bounty) => (
              <div className="col-12 col-sm-6 col-md-5 col-lg-4" key={bounty.id}>
                <IssueListItem issue={bounty} key={bounty.id} size="sm" />
              </div>
            ))}
          {currentBounties?.length < 3 &&
            !loadingState &&
            renderNothingFound(isOpen ? "open" : "funding")}
          </HorizontalList>
        </div>
      </CustomContainer>
    );
  }

  return (
    <>
      {renderBounties("open")}
      {renderBounties("funding")}
    </>
  );
}
