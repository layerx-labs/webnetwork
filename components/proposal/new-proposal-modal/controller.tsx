import {useState} from "react";
import {components as RSComponents, SingleValueProps} from "react-select";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import Avatar from "components/avatar";
import AvatarOrIdenticon from "components/avatar-or-identicon";
import Badge from "components/badge";
import Button from "components/button";
import { ContextualSpan } from "components/contextual-span";
import ContractButton from "components/contract-button";
import IconOption from "components/icon-option";
import If from "components/If";
import Modal from "components/modal";
import OpenGraphPreview from "components/open-graph-preview/controller";
import ReactSelect from "components/react-select";

import {useAppState} from "contexts/app-state";

import calculateDistributedAmounts from "helpers/calculateDistributedAmounts";
import { formatStringToCurrency } from "helpers/formatNumber";
import { truncateAddress } from "helpers/truncate-address";

import {NetworkEvents} from "interfaces/enums/events";
import {Deliverable, IssueBigNumberData} from "interfaces/issue-data";

import useApi from "x-hooks/use-api";
import useBepro from "x-hooks/use-bepro";

function SingleValue (props: SingleValueProps<any>) {
  const data = props.getValue()[0];
  return (
  <RSComponents.SingleValue {...props}>
    <div className="d-flex align-items-center p-1">
      <Avatar userLogin={data?.githubLogin} />
      <span className="ml-1 text-nowrap">{data?.label}</span>
    </div>
  </RSComponents.SingleValue>
  )
}

function SelectOptionComponent({ innerProps, innerRef, data }) {
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="proposal__select-options d-flex align-items-center text-center p-small p-1"
    >
      <Avatar userLogin={data?.githubLogin} />
      <span
        className={`ml-1 text-nowrap ${
          data.isDisable ? "text-light-gray" : "text-gray hover-primary"
        }`}
      >
        {data?.label}
      </span>
    </div>
  );
}

interface ProposalModalProps {
  amountTotal: BigNumber | string | number;
  deliverables: Deliverable[];
  show: boolean;
  onCloseClick: () => void;
  currentBounty: IssueBigNumberData;
  updateBountyData: (updatePrData?: boolean) => void;
}

export default function ProposalModal({
  amountTotal,
  deliverables = [],
  show,
  onCloseClick,
  currentBounty,
  updateBountyData
}: ProposalModalProps) {
  const { t } = useTranslation([
    "common",
    "bounty",
    "proposal",
    "deliverable"
  ]);

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

  return (
    <Modal
      show={show}
      title={t("proposal:actions.new")}
      titlePosition="center"
      onCloseClick={handleClose}
      footer={
        <div className="d-flex justify-content-between">
          <Button color="dark-gray" onClick={handleClose}>
            {t("actions.cancel")}
          </Button>
          <ContractButton
            onClick={handleClickCreate}
            disabled={!state.currentUser?.walletAddress || executing}
            isLoading={executing}
            withLockIcon={!state.currentUser?.walletAddress}
          >
            <span>{t("proposal:actions.create")}</span>
          </ContractButton>
        </div>
      }
    >
      <p className="xs-medium text-gray-100 text-uppercase mb-2">
        {t("deliverable:select")}
      </p>

      <ReactSelect
        id="deliverableSelect"
        components={{
          Option: IconOption,
          SingleValue
        }}
        placeholder={t("forms.select-placeholder")}
        value={deliverableToOption(currentDeliverable)}
        options={deliverables?.map(deliverableToOption)}
        isOptionDisabled={(option) => option.isDisable}
        onChange={handleChangeSelect}
        isSearchable={false}
      />

      <div className="mt-4 pt-2">
        <OpenGraphPreview
          url={currentDeliverable?.deliverableUrl}
          previewPlaceholder="Preview Deliverable"
          openLinkText="View Deliverable"
          showOpenLink
        />
      </div>

      <div className="mt-4 pt-1">
        <span className="xs-medium text-gray-100 text-uppercase">
          Payment
        </span>

        <div className="mt-1 mb-2 d-flex flex-column align-items-center border border-radius-4 border-gray-800 comment">
          <If
            condition={!!currentDeliverable && !!distributedAmounts}
            otherwise={
              <span className="p-5 sm-regular text-gray-600">
                Select a Deliverable
              </span>
            }
          >
            <div className="d-flex flex-column bg-gray-850 w-100 p-2">
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <AvatarOrIdenticon
                    user={deliverableUserLogin}
                    address={deliverableUserAddress}
                    size="sm"
                  />

                  <span className="xs-small text-gray-100">
                    { deliverableUserLogin ? `@${deliverableUserLogin}` : truncateAddress(deliverableUserAddress) }
                  </span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="sm-regular text-gray-50">
                    {formatStringToCurrency(currentBounty?.amount?.toFixed())}
                  </span>

                  <span className="sm-regular text-gray-500">
                    {currentBounty?.transactionalToken?.symbol}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-between w-100">
                <span className="xs-small text-gray-500 text-uppercase">
                  Deliverable Creator
                </span>

                <span className="xs-small text-gray-500 text-uppercase">
                  {distributedAmounts?.proposals?.at(0)?.percentage} %
                </span>
              </div>
            </div>

            <div className="d-flex flex-column bg-gray-850 w-100 p-2">
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <AvatarOrIdenticon
                    user={state.currentUser?.login}
                    address={state.currentUser?.walletAddress}
                    size="sm"
                  />

                  <span className="xs-small text-gray-100">
                    { state.currentUser?.login ? `@${state.currentUser?.login}` : truncateAddress(state.currentUser?.walletAddress) }
                  </span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="sm-regular text-gray-50">
                    {formatStringToCurrency(currentBounty?.amount?.toFixed())}
                  </span>

                  <span className="sm-regular text-gray-500">
                    {currentBounty?.transactionalToken?.symbol}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-between w-100">
                <span className="xs-small text-gray-500 text-uppercase">
                  Proposal Creator
                </span>

                <span className="xs-small text-gray-500 text-uppercase">
                  {distributedAmounts?.proposerAmount?.percentage} %
                </span>
              </div>
            </div>
          </If>
        </div>

        <If condition={!!currentDeliverable && !!distributedAmounts}>
          <ContextualSpan context="info" color="blue-200">
            Complete fees information can be seen after creating proposal
          </ContextualSpan>
        </If>
      </div>
    </Modal>
  );
}
