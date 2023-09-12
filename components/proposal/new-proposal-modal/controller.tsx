import {useState} from "react";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Badge from "components/badge";
import NewProposalModalView from "components/proposal/new-proposal-modal/view";

import {useAppState} from "contexts/app-state";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { truncateAddress } from "helpers/truncate-address";

import {NetworkEvents} from "interfaces/enums/events";
import {Deliverable, IssueBigNumberData} from "interfaces/issue-data";

import useApi from "x-hooks/use-api";
import useBepro from "x-hooks/use-bepro";

interface ProposalModalProps {
  deliverables: Deliverable[];
  show: boolean;
  onCloseClick: () => void;
  currentBounty: IssueBigNumberData;
  updateBountyData: (updatePrData?: boolean) => void;
}

export default function ProposalModal({
  deliverables = [],
  show,
  onCloseClick,
  currentBounty,
  updateBountyData
}: ProposalModalProps) {
  const { t } = useTranslation("proposal");

  const [executing, setExecuting] = useState<boolean>(false);
  const [currentDeliverable, setCurrentDeliverable] = useState<Deliverable>();

  const { state } = useAppState();
  const { processEvent } = useApi();
  const { handleProposeMerge } = useBepro();

  const { treasury, mergeCreatorFeeShare, proposerFeeShare } = state.Service?.network?.amounts || {};

  const deliverableUserAddress = currentDeliverable?.user?.address;
  const deliverableUserLogin = currentDeliverable?.user?.githubLogin;
  const distributedAmounts = treasury ? calculateDistributedAmounts(treasury,
                                                                    mergeCreatorFeeShare,
                                                                    proposerFeeShare,
                                                                    BigNumber(currentBounty?.amount),
                                                                    [
                                                                      {
                                                                        recipient: deliverableUserAddress, 
                                                                        percentage: 100
                                                                      }
                                                                    ]) : null;
  const paymentInfos = [
    {
      address: deliverableUserAddress,
      login: deliverableUserLogin,
      amount: distributedAmounts?.proposals?.at(0)?.value,
      symbol: currentBounty?.transactionalToken?.symbol,
      percentage: distributedAmounts?.proposals?.at(0)?.percentage,
      label: t("create-modal.deliverable-creator"),
    },
    {
      address: state.currentUser?.walletAddress,
      login: state.currentUser?.login,
      amount: distributedAmounts?.proposerAmount?.value,
      symbol: currentBounty?.transactionalToken?.symbol,
      percentage: distributedAmounts?.proposerAmount?.percentage,
      label: t("create-modal.proposal-creator"),
    }
  ];

  async function handleClickCreate(): Promise<void> {
    if (!currentDeliverable) return;

    const prCreator = currentDeliverable.user?.address;

    setExecuting(true);

    handleProposeMerge(+currentBounty.contractId, +currentDeliverable.prContractId, [prCreator], [100])
      .then(txInfo => {
        const { blockNumber: fromBlock } = txInfo as { blockNumber: number };

        return processEvent(NetworkEvents.ProposalCreated, undefined, { fromBlock });
      })
      .then(() => {
        handleClose();
        setExecuting(false);
        updateBountyData();
      });
  }

  function handleClose() {
    onCloseClick();
    setCurrentDeliverable(undefined);
  }

  function handleChangeSelect({ value }) {
    const newDeliverable = deliverables.find((el) => el.id === value);
    if (newDeliverable)
      setCurrentDeliverable(newDeliverable);
  }

  function deliverableToOption(deliverable: Deliverable) {
    if (!deliverable) return;

    return {
      value: deliverable?.id,
      spaceBetween: true,
      label:  <div className="d-flex flex-column">
                <span className="sm-regular text-white text-capitalize text-overflow-ellipsis">
                  {deliverable?.title}
                </span>
                <div className="d-flex align-items-center mx-n1 mt-1">
                  <AvatarOrIdenticon
                    address={deliverable?.user?.address}
                    user={deliverable?.user?.githubLogin}
                    size="sm"
                  />
                  <span className="xs-small text-gray-500 font-weight-normal text-capitalize">
                    {deliverable?.user?.githubLogin ?? truncateAddress(deliverable?.user?.address)}
                  </span>
                </div>
              </div>,
      postIcon: <Badge 
                  label={currentBounty?.type} 
                  className="xs-small bg-primary bg-opacity-25 border border-primary font-weight-normal text-capitalize"
                />
    }
  }

  return(
    <NewProposalModalView
      show={show}
      isExecuting={executing}
      isConnected={!!state.currentUser?.walletAddress}
      selectedDeliverable={deliverableToOption(currentDeliverable)}
      deliverablesOptions={deliverables?.map(deliverableToOption)}
      deliverableUrl={currentDeliverable?.deliverableUrl}
      paymentInfos={distributedAmounts ? paymentInfos : null}
      onClose={handleClose}
      onSubmit={handleClickCreate}
      onDeliverableChange={handleChangeSelect}
    />
  );
}
