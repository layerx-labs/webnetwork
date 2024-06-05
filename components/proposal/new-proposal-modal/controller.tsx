import {useState} from "react";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Badge from "components/badge";
import NewProposalModalView from "components/proposal/new-proposal-modal/view";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { lowerCaseCompare } from "helpers/string";
import {truncateAddress} from "helpers/truncate-address";

import { User } from "interfaces/api";
import {NetworkEvents} from "interfaces/enums/events";
import {Deliverable, IssueBigNumberData} from "interfaces/issue-data";

import {PaymentInfoProps} from "types/components";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";
import useMarketplace from "x-hooks/use-marketplace";

interface ProposalModalProps {
  deliverables: Deliverable[];
  show: boolean;
  onCloseClick: () => void;
  currentBounty: IssueBigNumberData;
  updateBountyData: (updatePrData?: boolean) => void;
}

export interface DistributionParticipant {
  user: User;
  percentage: number;
  isDeliverableCreator?: boolean;
}

export default function ProposalModal({
  deliverables = [],
  show,
  onCloseClick,
  currentBounty,
  updateBountyData
}: ProposalModalProps) {
  const { t } = useTranslation("proposal");

  const [isEditingDistribution, setIsEditingDistribution] = useState(false);
  const [currentDeliverable, setCurrentDeliverable] = useState<Deliverable>();
  const [distributionParticipants, setDistributionParticipants] = useState<DistributionParticipant[]>([]);

  const marketplace = useMarketplace();
  const { currentUser } = useUserStore();
  const { handleProposeMerge } = useBepro();
  const [isExecuting, onCreateProposal] = useContractTransaction( NetworkEvents.ProposalCreated,
                                                                  handleProposeMerge,
                                                                  t("messages.proposal-created"),
                                                                  t("errors.failed-to-create"));

  const { chain, mergeCreatorFeeShare, proposerFeeShare } = marketplace?.active || {};
  const distributedAmounts = chain ? calculateDistributedAmounts( chain.closeFeePercentage,
                                                                  mergeCreatorFeeShare,
                                                                  proposerFeeShare,
                                                                  BigNumber(currentBounty?.amount),
                                                                  distributionParticipants.map(participant => ({
                                                                    user: participant?.user,
                                                                    recipient: participant?.user?.address,
                                                                    percentage: participant?.percentage,
                                                                  }))) : null;

  const isDeliverableCreator = address => lowerCaseCompare(currentDeliverable?.user?.address, address);
  const paymentInfos: PaymentInfoProps[] = [
    ...distributedAmounts?.proposals?.map((distributed, index) => ({
      address: distributed?.recipient,
      login: distributed?.handle, 
      avatar: distributed?.avatar,
      amount: distributed?.value,
      symbol: currentBounty?.transactionalToken?.symbol,
      percentage: distributed?.percentage,
      label: isDeliverableCreator(distributed?.recipient) ? 
        t("create-modal.deliverable-creator") : `Participant ${index}`,
    })) || [],
    {
      address: currentUser?.walletAddress,
      login: currentUser?.login,
      avatar: currentUser?.avatar,
      amount: distributedAmounts?.proposerAmount?.value,
      symbol: currentBounty?.transactionalToken?.symbol,
      percentage: distributedAmounts?.proposerAmount?.percentage,
      label: t("create-modal.proposal-creator"),
    }
  ];

  const onEditDistributionClick = () => setIsEditingDistribution(true);
  
  function onCancelDistributionEditClick() {
    setIsEditingDistribution(false);
  }

  async function handleClickCreate(): Promise<void> {
    if (!currentDeliverable) return;

    const recipients = distributionParticipants.map(p => p.user.address);
    const percentages = distributionParticipants.map(p => p.percentage);

    onCreateProposal(+currentBounty.contractId, +currentDeliverable.prContractId, recipients, percentages)
      .then(() => {
        handleClose();
        updateBountyData();
      })
      .catch(console.debug);
  }

  function handleClose() {
    onCloseClick();
    setIsEditingDistribution(false);
    setCurrentDeliverable(undefined);
    setDistributionParticipants([]);
  }

  function handleChangeSelect({ value }) {
    const newDeliverable = deliverables.find((el) => el.id === value);
    if (!newDeliverable) return;
    setCurrentDeliverable(newDeliverable);
    setIsEditingDistribution(false);
    setDistributionParticipants([
      {
        user: newDeliverable?.user,
        percentage: 100,
        isDeliverableCreator: true,
      }
    ]);
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
                <div className="d-flex align-items-center mt-1 gap-2">
                  <AvatarOrIdenticon
                    user={deliverable?.user}
                    size="xsm"
                  />
                  <span className="xs-small text-gray-500 font-weight-normal text-capitalize">
                    {deliverable?.user?.handle ?? truncateAddress(deliverable?.user?.address)}
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
      isExecuting={isExecuting}
      task={currentBounty}
      currentDeliverable={currentDeliverable}
      isConnected={!!currentUser?.walletAddress}
      selectedDeliverable={deliverableToOption(currentDeliverable)}
      deliverablesOptions={deliverables?.filter(d => d?.markedReadyForReview && !d?.canceled)?.map(deliverableToOption)}
      deliverableUrl={currentDeliverable?.deliverableUrl}
      distributionParticipants={distributionParticipants}
      paymentInfos={distributedAmounts ? paymentInfos : null}
      isEditingDistribution={isEditingDistribution}
      onClose={handleClose}
      onSubmit={handleClickCreate}
      onDeliverableChange={handleChangeSelect}
      onEditDistributionClick={onEditDistributionClick}
      onCancelDistributionEditClick={onCancelDistributionEditClick}
      setDistributionParticipants={setDistributionParticipants}
    />
  );
}
