import { useEffect, useState } from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import router, { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import { IFilesProps } from "components/drag-and-drop";
import CreateTaskPageView from "components/pages/task/create-task/view";

import { BODY_CHARACTERES_LIMIT } from "helpers/constants";
import {formatStringToCurrency} from "helpers/formatNumber";
import { addFilesToMarkdown } from "helpers/markdown";
import { lowerCaseCompare } from "helpers/string";
import { parseTransaction } from "helpers/transactions";
import { isValidUrl } from "helpers/validateUrl";

import { EventName } from "interfaces/analytics";
import { BountyPayload } from "interfaces/create-bounty";
import { CustomSession } from "interfaces/custom-session";
import { CreateTaskSections } from "interfaces/enums/create-task-sections";
import { MetamaskErrors, OriginLinkErrors } from "interfaces/enums/Errors";
import { NetworkEvents } from "interfaces/enums/events";
import { AllowListTypes } from "interfaces/enums/marketplace";
import { TransactionStatus } from "interfaces/enums/transaction-status";
import { TransactionTypes } from "interfaces/enums/transaction-types";
import { Network } from "interfaces/network";
import {DistributionsProps} from "interfaces/proposal";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";
import { SimpleBlockTransactionPayload } from "interfaces/transaction";

import { UserRoleUtils } from "server/utils/jwt";

import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import useGetIsAllowed from "x-hooks/api/marketplace/management/allow-list/use-get-is-allowed";
import { useCreatePreBounty } from "x-hooks/api/task";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { transactionStore } from "x-hooks/stores/transaction-list/transaction.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useAnalyticEvents from "x-hooks/use-analytic-events";
import useBepro from "x-hooks/use-bepro";
import useERC20 from "x-hooks/use-erc20";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";
import { useSettings } from "x-hooks/use-settings";

const ZeroNumberFormatValues = {
  value: "",
  formattedValue: "",
  floatValue: 0,
};

interface CreateTaskPageProps {
  networks: Network[];
}

export default function CreateTaskPage ({
  networks: allNetworks
}: CreateTaskPageProps) {
  const session = useSession();
  const { query } = useRouter();
  const { t } = useTranslation(["common", "bounty"]);

  const [files, setFiles] = useState<IFilesProps[]>([]);
  const [rewardToken, setRewardToken] = useState<Token>();
  const [bountyTitle, setBountyTitle] = useState<string>("");
  const [customTokens, setCustomTokens] = useState<Token[]>([]);
  const [isTokenApproved, setIsTokenApproved] = useState(false);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isFundingType, setIsFundingType] = useState<boolean>(false);
  const [rewardChecked, setRewardChecked] = useState<boolean>(false);
  const [isKyc, setIsKyc] = useState<boolean>(false);
  const [tierList, setTierList] = useState<number[]>([]);
  const [transactionalToken, setTransactionalToken] = useState<Token>();
  const [bountyDescription, setBountyDescription] = useState<string>("");
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);
  const [isLoadingCreateBounty, setIsLoadingCreateBounty] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [issueAmount, setIssueAmount] = useState<NumberFormatValues>(ZeroNumberFormatValues);
  const [rewardAmount, setRewardAmount] = useState<NumberFormatValues>(ZeroNumberFormatValues);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentNetwork, setCurrentNetwork] = useState<Network>();
  const [networksOfConnectedChain, setNetworksOfConnectedChain] = useState<Network[]>([]);
  const [deliverableType, setDeliverableType] = useState<string>();
  const [originLink, setOriginLink] = useState<string>("");
  const [originLinkError, setOriginLinkError] = useState<OriginLinkErrors>();
  const [userCanCreateBounties, setUserCanCreateBounties] = useState<boolean>(true);
  const [showCannotCreateBountyModal, setShowCannotCreateBountyModal] = useState<boolean>(true);
  const [previewAmount, setPreviewAmount] = useState<NumberFormatValues>(ZeroNumberFormatValues);
  const [distributions, setDistributions] = useState<DistributionsProps>();
  const [currentChain, setCurrentChain] = useState<SupportedChainData>();


  const rewardERC20 = useERC20();
  const transactionalERC20 = useERC20();
  const { handleApproveToken } = useBepro();
  const { updateParamsOfActive, getURLWithNetwork } = useMarketplace();
  const { processEvent } = useProcessEvent();
  const { addError, addWarning } = useToastStore();
  const { service: daoService } = useDaoStore();
  const { pushAnalytic } = useAnalyticEvents();

  const { settings } = useSettings();
  const { currentUser } = useUserStore();
  const { mutateAsync: createPreBounty } = useReactQueryMutation({
    mutationFn: useCreatePreBounty,
  });

  const { add: addTx, update: updateTx, list: transactions } = transactionStore()

  const steps = [
    t("bounty:steps.select-network"),
    t("bounty:steps.details"),
    t("bounty:steps.reward"),
    t("bounty:steps.review"),
  ];

  const isAmountApproved = (tokenAllowance: BigNumber, amount: BigNumber) =>
    !tokenAllowance.lt(amount);

  const handleIsLessThan = (v: number, min: string) =>
    BigNumber(v).isLessThan(BigNumber(min));

  async function addToken (newToken: Token) {
    setCustomTokens([...customTokens, newToken]);
  }

  function validateBannedDomain (link: string) {
    return !!currentNetwork?.banned_domains?.some(banned => link.toLowerCase().includes(banned.toLowerCase()));
  }

  const validateDomainDebounced = useDebouncedCallback((link: string) => {
    if (!link) {
      setOriginLinkError(undefined);
      return;
    }
    const isValid = isValidUrl(link);
    const isBanned = validateBannedDomain(link);
    if (!isValid)
      setOriginLinkError(OriginLinkErrors.Invalid);
    else if (isBanned)
      setOriginLinkError(OriginLinkErrors.Banned);
    else
      setOriginLinkError(undefined);
  }, 500);

  function handleOriginLinkChange (newLink: string) {
    setOriginLink(newLink);
    validateDomainDebounced(newLink);
  }

  function onUpdateFiles (files: IFilesProps[]) {
    return setFiles(files);
  }

  function handleRewardChecked (e) {
    setRewardChecked(e.target.checked);
    if (!e.target.checked) {
      setRewardAmount(ZeroNumberFormatValues);
      setRewardToken(undefined);
    }
  }

  function verifyNextStepAndCreate (newSection?: number) {
    if (!userCanCreateBounties)
      return true;

    const section = newSection || currentSection
    if (isLoadingCreateBounty) return true;

    const isIssueAmount =
      issueAmount.floatValue <= 0 ||
      issueAmount.floatValue === undefined ||
      handleIsLessThan(issueAmount.floatValue, transactionalToken?.minimum) ||
      (!isFundingType && BigNumber(issueAmount.floatValue).gt(transactionalERC20?.balance))

    const isRewardAmount =
      rewardAmount.floatValue <= 0 ||
      rewardAmount.floatValue === undefined ||
      handleIsLessThan(rewardAmount.floatValue, rewardToken?.minimum) ||
      BigNumber(issueAmount.floatValue).gt(rewardERC20?.balance)

    if (section === 0 && !currentNetwork) return true;

    if (
      section === 1 &&
      (!bountyTitle ||
        !bountyDescription ||
        selectedTags?.length === 0 ||
        isUploading ||
        addFilesInDescription(bountyDescription).length >
        BODY_CHARACTERES_LIMIT ||
        bountyTitle.length >= 131)
    )
      return true;

    if (section === 1 && (!deliverableType || !!originLinkError)) return true;

    if (section === 2 && !isFundingType && isIssueAmount) return true;
    if (
      section === 2 &&
      isFundingType &&
      !rewardChecked &&
      isIssueAmount
    )
      return true;
    if (section === 2 && isFundingType && rewardChecked && isIssueAmount)
      return true;
    if (
      section === 2 &&
      isFundingType &&
      rewardChecked &&
      isRewardAmount
    )
      return true;

    if (
      section === 2 &&
      isKyc &&
      settings?.kyc?.tierList?.length &&
      !tierList.length
    )
      return true;

    if (section === 3 && !isTokenApproved) return true;

    return section === 3 && isLoadingCreateBounty;
  }

  function addFilesInDescription (str) {
    return addFilesToMarkdown(str, files, settings?.urls?.ipfs);
  }

  async function allowCreateIssue () {
    if (!daoService || !transactionalToken || issueAmount.floatValue <= 0 || !userCanCreateBounties)
      return;

    setIsLoadingApprove(true);

    let tokenAddress = transactionalToken.address;
    let bountyValue = issueAmount.formattedValue;
    let tokenERC20 = transactionalERC20;

    if (rewardChecked && rewardToken?.address && rewardAmount.floatValue > 0) {
      tokenAddress = rewardToken.address;
      bountyValue = rewardAmount.formattedValue;
      tokenERC20 = rewardERC20;
    }

    pushAnalytic(EventName.CREATE_TASK_APPROVE_AMOUNT, {
      neededAmount: bountyValue,
      currentAllowance: tokenERC20.allowance.toFixed()
    })

    handleApproveToken(tokenAddress, bountyValue, undefined, transactionalToken?.symbol)
      .then(() =>
        tokenERC20.updateAllowanceAndBalance()
          .then(({ allowance }) => {
            pushAnalytic(EventName.CREATE_TASK_APPROVE_AMOUNT, {
              neededAmount: bountyValue,
              currentAllowance: allowance.toFixed(),
              finished: true
            })
          }))
      .catch(error => {
        console.debug("Failed to approve", error)
        pushAnalytic(EventName.CREATE_TASK_APPROVE_AMOUNT, {
          neededAmount: bountyValue,
          error: true,
          errorMsg: error.toString(),
        })
      })
      .finally(() => setIsLoadingApprove(false));
  }

  const verifyTransactionState = (type: TransactionTypes): boolean =>
    !!transactions.find((transactions) =>
      transactions.type === type &&
      transactions.status === TransactionStatus.pending);

  const isApproveButtonDisabled = (): boolean =>
    [
      userCanCreateBounties,
      !isTokenApproved,
      !verifyTransactionState(TransactionTypes.approveTransactionalERC20Token),
    ].some((value) => value === false);

  async function createBounty () {
    if (!deliverableType || !transactionalToken || !daoService || !currentUser)
      return;

    if (!(await useGetIsAllowed(currentNetwork.id, currentUser.walletAddress, AllowListTypes.OPEN_TASK))?.allowed) // triple check for bounty creation permission
      return (setShowCannotCreateBountyModal(true), null);

    setIsLoadingCreateBounty(true);

    try {
      const payload = {
        title: bountyTitle,
        body: addFilesInDescription(bountyDescription),
        amount: issueAmount.formattedValue,
        creatorAddress: currentUser.walletAddress,
        githubUser: currentUser?.login,
        deliverableType,
        originLink
      };

      pushAnalytic(EventName.CREATE_PRE_TASK, { start: true })

      const savedIssue = await useCreatePreBounty({
        title: payload.title,
        body: payload.body,
        creator: payload.githubUser,
        deliverableType,
        origin: originLink,
        tags: selectedTags,
        isKyc: isKyc,
        tierList: tierList?.length ? tierList : null,
        amount: issueAmount.value,
        networkName: currentNetwork?.name
      });

      if (!savedIssue) {
        pushAnalytic(EventName.CREATE_PRE_TASK, { error: true })
        addError(t("actions.failed"), t("bounty:errors.creating-bounty"));
        return;
      }

      pushAnalytic(EventName.CREATE_PRE_TASK, {
        saved: true,
        id: savedIssue.id,
        finished: true,
      });

      const transactionToast = addTx({
        type: TransactionTypes.openIssue,
        amount: payload.amount,
        network: currentNetwork,
        currency: transactionalToken?.symbol,
      });

      const bountyPayload: BountyPayload = {
        cid: savedIssue.ipfsUrl,
        transactional: transactionalToken.address,
        title: payload.title,
        tokenAmount: payload.amount
      };

      if (isFundingType && !rewardChecked) {
        bountyPayload.tokenAmount = "0";
        bountyPayload.fundingAmount = issueAmount.formattedValue;
      }

      if (isFundingType && rewardChecked) {
        bountyPayload.tokenAmount = "0";
        bountyPayload.rewardAmount = rewardAmount.formattedValue;
        bountyPayload.rewardToken = rewardToken.address;
        bountyPayload.fundingAmount = issueAmount.formattedValue;
      }

      const networkBounty = await daoService
        .openBounty(bountyPayload)
        .catch((e) => {
          updateTx({
            ...transactionToast,
            status:
              e?.code === MetamaskErrors.UserRejected
                ? TransactionStatus.failed
                : TransactionStatus.failed,
          } as SimpleBlockTransactionPayload);

          if (e?.code === MetamaskErrors.ExceedAllowance)
            addError(t("actions.failed"), t("bounty:errors.exceeds-allowance"));
          else if (e?.code === MetamaskErrors.UserRejected)
            addError(t("actions.failed"), t("bounty:errors.bounty-canceled"));
          else
            addError(t("actions.failed"), e.message || t("bounty:errors.creating-bounty"));

          console.debug(e);

          return { ...e, error: true };
        });

      const returnValues = networkBounty?.events?.BountyCreated?.returnValues;

      pushAnalytic(EventName.CREATED_TASK, {
        contractId: returnValues?.id,
        id: returnValues?.cid,
        transaction: networkBounty.transactionHash,
        error: !!networkBounty?.error,
        errorCode: networkBounty?.code,
      })

      if (networkBounty?.error !== true) {
        updateTx(parseTransaction(networkBounty, transactionToast as SimpleBlockTransactionPayload));

        const createdBounty = await processEvent(NetworkEvents.BountyCreated, currentNetwork?.networkAddress, {
          fromBlock: networkBounty?.blockNumber
        }, currentNetwork?.name)
          .catch(() => null);

        if (!createdBounty) {
          addWarning(t("actions.warning"), t("bounty:errors.sync"));
        }

        if (createdBounty?.[savedIssue.id]) {
          router.push(getURLWithNetwork("/task/[id]", {
            network: currentNetwork?.name,
            id: savedIssue.id
          }))
            .then(() => cleanFields());
        }
      }
    } finally {
      setIsLoadingCreateBounty(false);
    }
  }

  function cleanFields () {
    setFiles([]);
    setSelectedTags([]);
    setBountyTitle("");
    setBountyDescription("");
    setIssueAmount(ZeroNumberFormatValues);
    setRewardAmount(ZeroNumberFormatValues);
    setDeliverableType(undefined);
    setOriginLink("");
    setIsKyc(false);
    setTierList([]);
    setCurrentSection(0);
    rewardERC20.setAddress(undefined);
    transactionalERC20.setAddress(undefined);
  }

  function handleMinAmount (type: "reward" | "transactional") {
    if (currentSection === 3) {
      const amount = type === "reward" ? rewardAmount : issueAmount
      const isAmount =
        amount.floatValue <= 0 ||
        amount.floatValue === undefined ||
        handleIsLessThan(amount.floatValue, transactionalToken?.minimum);

      if (isAmount) setCurrentSection(2)
    }
  }


  function handleUpdateToken (e: Token, type: 'transactional' | 'reward') {
    const ERC20 = type === 'transactional' ? transactionalERC20 : rewardERC20
    const setToken = type === 'transactional' ? setTransactionalToken : setRewardToken
    setToken(e)
    ERC20.setAddress(e.address)
  }

  async function handleNextStep () {
    if (!userCanCreateBounties)
      return;

    if (currentSection + 1 < steps.length) {
      setCurrentSection((prevState) => prevState + 1);
    }

    if (currentSection === 3) {
      createBounty();
    }
  }

  useEffect(() => {
    if (!query?.marketplace)
      return;
    const marketplace = allNetworks?.find(m => lowerCaseCompare(m?.name, query?.marketplace?.toString()));
    if (!marketplace)
      return;
    handleNetworkSelected(marketplace.chain, marketplace);
  }, []);

  useEffect(() => {
    let approved = true;

    if (!isFundingType)
      approved = isAmountApproved(transactionalERC20.allowance,
                                  BigNumber(issueAmount.formattedValue));
    else if (rewardChecked)
      approved = isAmountApproved(rewardERC20.allowance,
                                  BigNumber(rewardAmount.formattedValue));

    setIsTokenApproved(approved);
  }, [
    transactionalERC20.allowance,
    rewardERC20.allowance,
    issueAmount,
    rewardAmount,
    rewardChecked,
  ]);

  useEffect(() => {
    if (currentSection !== 2) return;
    if (!currentNetwork?.tokens) {
      setTransactionalToken(undefined);
      setRewardToken(undefined);
      setCustomTokens([]);
      transactionalERC20.setAddress(undefined);
      rewardERC20.setAddress(undefined);
      return;
    } else {
      const tokens = currentNetwork?.tokens

      if (tokens.length === 1) {
        handleUpdateToken(tokens[0], 'transactional');
        handleUpdateToken(tokens[0], 'reward');
      }

      if (tokens.length !== customTokens.length)
        setCustomTokens(tokens)
    }
  }, [currentNetwork?.tokens, currentSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    pushAnalytic(`${EventName.TASK_SECTION_CHANGE}_${CreateTaskSections[currentSection]}` as unknown as EventName)
  }, [currentSection])

  useEffect(() => handleMinAmount('transactional'), [issueAmount])
  useEffect(() => handleMinAmount('reward'), [rewardAmount])
  useEffect(() => {
    setUserCanCreateBounties(!currentNetwork?.id ? true : !currentNetwork?.allow_list?.length ? true :
      (session?.data as CustomSession)?.user?.roles
        ? UserRoleUtils.hasCreateTaskRole((session?.data as CustomSession)?.user?.roles, currentNetwork?.id)
        : true) // if no session roles are found we will let the normal flow deal with an unauthenticated user
  }, [currentNetwork]);
  useEffect(() => {
    setShowCannotCreateBountyModal(!userCanCreateBounties)
  }, [userCanCreateBounties]);

  useEffect(() => {
    cleanFields();

    if (query?.type === "funding")
      setIsFundingType(true);
  }, []);

  async function handleNetworkSelected (chain: SupportedChainData, network: Network = null) {
    setCurrentNetwork(network);
    setCurrentChain(chain);
    setTransactionalToken(null);
    setRewardToken(null);
    setCustomTokens([]);
    transactionalERC20.setAddress(undefined);
    rewardERC20.setAddress(undefined);
    const networksOfChain = allNetworks.filter(({ chain_id }) => +chain_id === +chain?.chainId);
    setNetworksOfConnectedChain(networksOfChain);
  }

  function handleBackButton () {
    if (currentSection !== 0)
      setCurrentSection((prevState) => prevState - 1);
  }

  async function onNetworkSelected (opt) {
    setCurrentNetwork(opt);
    updateParamsOfActive(opt);
  }

  function handleSectionHeaderClick (i: number) {
    if (!verifyNextStepAndCreate(i === 0 ? i : i - 1) || currentSection > i) {
      setCurrentSection(i)
    }
  }

  return (
    <CreateTaskPageView
      isConnected={!!currentUser?.walletAddress}
      deliverableType={deliverableType}
      currentSection={currentSection}
      isTokenApproved={isTokenApproved}
      isBackButtonDisabled={currentSection === 0}
      isApproveButtonDisabled={isApproveButtonDisabled()}
      isApproving={isLoadingApprove}
      isNextOrCreateButtonDisabled={verifyNextStepAndCreate()}
      isCreating={isLoadingCreateBounty}
      creationSteps={steps}
      onBackClick={handleBackButton}
      onApproveClick={allowCreateIssue}
      onNextOrCreateButtonClick={handleNextStep}
      onSectionHeaderClick={handleSectionHeaderClick}
      currentNetwork={currentNetwork}
      currentChain={currentChain}
      networksOfCurrentChain={networksOfConnectedChain}
      onChainChange={handleNetworkSelected}
      onNetworkChange={onNetworkSelected}
      title={bountyTitle}
      updateTitle={setBountyTitle}
      description={bountyDescription}
      updateDescription={setBountyDescription}
      files={files}
      updateFiles={onUpdateFiles}
      selectedTags={selectedTags}
      updateSelectedTags={setSelectedTags}
      isKyc={isKyc}
      updateIsKyc={setIsKyc}
      updateTierList={setTierList}
      updateUploading={setIsUploading}
      originLink={originLink}
      originLinkError={originLinkError}
      onOriginLinkChange={handleOriginLinkChange}
      setDeliverableType={setDeliverableType}
      isFundingType={isFundingType}
      rewardChecked={rewardChecked}
      transactionalToken={transactionalToken}
      rewardToken={rewardToken}
      bountyDecimals={transactionalERC20?.decimals}
      rewardDecimals={transactionalERC20?.decimals}
      issueAmount={issueAmount}
      rewardAmount={rewardAmount}
      bountyTokens={customTokens.filter((token) => !!token?.network_tokens?.isTransactional)}
      rewardTokens={customTokens.filter((token) => !!token?.network_tokens?.isReward)}
      rewardBalance={rewardERC20.balance}
      bountyBalance={transactionalERC20.balance}
      updateRewardToken={(v) => handleUpdateToken(v, 'reward')}
      updateTransactionalToken={(v) => handleUpdateToken(v, 'transactional')}
      addToken={addToken}
      handleRewardChecked={handleRewardChecked}
      updateIssueAmount={setIssueAmount}
      updateRewardAmount={setRewardAmount}
      updateIsFundingType={setIsFundingType}
      payload={{
        marketplace: currentNetwork?.name,
        title: bountyTitle,
        description: addFilesInDescription(bountyDescription),
        tags: selectedTags && selectedTags,
        originLink: originLink,
        deliverableType: deliverableType,
        totalAmount: `${formatStringToCurrency(issueAmount.value)} ${transactionalToken?.symbol}`,
        fundersReward:
          (rewardAmount.value && isFundingType) &&
          `${formatStringToCurrency(rewardAmount.value)} ${rewardToken?.symbol}`,
      }}
      allowCreateBounty={userCanCreateBounties}
      showCannotCreateBountyModal={showCannotCreateBountyModal}
      closeCannotCreateBountyModal={() => setShowCannotCreateBountyModal(false)}
      previewAmount={previewAmount}
      setPreviewAmount={setPreviewAmount}
      distributions={distributions}
      setDistributions={setDistributions}
    />
  );
}