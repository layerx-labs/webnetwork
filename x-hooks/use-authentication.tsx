import {useState} from "react";

import BigNumber from "bignumber.js";
import {getCsrfToken, signIn as nextSignIn, signOut as nextSignOut, useSession} from "next-auth/react";
import getConfig from "next/config";
import {useRouter} from "next/router";

import {useAppState} from "contexts/app-state";
import {
  changeCurrentUserBalance,
  changeCurrentUserConnected,
  changeCurrentUserId,
  changeCurrentUserisAdmin,
  changeCurrentUserisCouncil,
  changeCurrentUserisGovernor,
  changeCurrentUserKycSession,
  changeCurrentUserLogin,
  changeCurrentUserMatch,
  changeCurrentUserSignature,
  changeCurrentUserWallet
} from "contexts/reducers/change-current-user";
import {changeReAuthorizeGithub} from "contexts/reducers/update-show-prop";

import {IM_AN_ADMIN, NOT_AN_ADMIN, UNSUPPORTED_CHAIN} from "helpers/constants";
import decodeMessage from "helpers/decode-message";
import {AddressValidator} from "helpers/validators/address";

import {EventName} from "interfaces/analytics";
import {CustomSession} from "interfaces/custom-session";
import {UserRole} from "interfaces/enums/roles";

import {WinStorage} from "services/win-storage";

import {SESSION_TTL} from "server/auth/config";

import {useSearchCurators} from "x-hooks/api/curator";
import {useGetKycSession, useValidateKycSession} from "x-hooks/api/kyc";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useAnalyticEvents from "x-hooks/use-analytic-events";
import useBepro from "x-hooks/use-bepro";
import useChain from "x-hooks/use-chain";
import {useDao} from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import useSignature from "x-hooks/use-signature";

import { useDaoStore } from "./stores/dao/dao.store";
import { useStorageTransactions } from "./use-storage-transactions";
import useSupportedChain from "./use-supported-chain";

export const SESSION_EXPIRATION_KEY =  "next-auth.expiration";

const { publicRuntimeConfig } = getConfig();

export function useAuthentication() {
  const [isLoadingSigningMessage, setIsLoadingSigningMessage] = useState(false);
  const session = useSession();
  const { asPath } = useRouter();

  const { connect } = useDao();
  const { chain } = useChain();
  const transactions = useStorageTransactions();
  const { addWarning } = useToastStore();
  const { service: daoService, serviceStarting} = useDaoStore();
  const marketplace = useMarketplace();
  const { isNetworkGovernor } = useBepro();
  const { state, dispatch } = useAppState();
  const { pushAnalytic } = useAnalyticEvents();
  const { signMessage: _signMessage, signInWithEthereum } = useSignature();
  const { connectedChain } = useSupportedChain();

  const [balance] = useState(new WinStorage('currentWalletBalance', 1000, 'sessionStorage'));

  const URL_BASE = typeof window !== "undefined" ? `${window.location.protocol}//${ window.location.host}` : "";

  function signOut(redirect?: string) {
    const expirationStorage = new WinStorage(SESSION_EXPIRATION_KEY, 0);

    expirationStorage.removeItem();
    transactions.deleteFromStorage();

    nextSignOut({
      callbackUrl: `${URL_BASE}/${redirect || ""}`
    });
  }

  async function signInWallet() {
    const address = await connect();

    if (!address) return;

    const csrfToken = await getCsrfToken();

    const issuedAt = new Date();
    const expiresAt = new Date(+issuedAt + SESSION_TTL);

    const signature = await signInWithEthereum(csrfToken, address, issuedAt, expiresAt);

    if (!signature) return;

    nextSignIn("credentials", {
      redirect: false,
      signature,
      issuedAt: +issuedAt,
      expiresAt: +expiresAt,
      callbackUrl: `${URL_BASE}${asPath}`
    });
  }

  function signInGithub() {
    nextSignIn("github", {
      callbackUrl: `${URL_BASE}${asPath}`
    });
  }

  function updateWalletBalance(force = false) {
    if ((!force && (balance.value || !state.currentUser?.walletAddress)) || !daoService?.network || !chain)
      return;

    const update = newBalance => {
      const newState = Object.assign(state.currentUser.balance || {}, newBalance);
      dispatch(changeCurrentUserBalance(newState));
      balance.value = newState;
    }

    Promise.all([
      daoService.getOraclesResume(state.currentUser.walletAddress),

      daoService.getBalance('settler', state.currentUser.walletAddress),
      useSearchCurators({
        address: state.currentUser.walletAddress,
        networkName: marketplace?.active?.name,
        chainShortName: chain.chainShortName
      })
      .then(v => v?.rows[0]?.tokensLocked || 0).then(value => new BigNumber(value)),
      // not balance, but related to address, no need for a second useEffect()
      daoService.isCouncil(state.currentUser.walletAddress),
      isNetworkGovernor(state.currentUser.walletAddress)
    ])
      .then(([oracles, bepro, staked, isCouncil, isGovernor]) => {
        update({oracles, bepro, staked});
        dispatch(changeCurrentUserisCouncil(isCouncil));
        dispatch(changeCurrentUserisGovernor(isGovernor));
      })
      .catch(error => console.debug("Failed to updateWalletBalance", error))
  }

  async function syncUserDataWithSession() {
    if (session?.status === "loading") return;

    const isUnauthenticated = session?.status === "unauthenticated";

    if (isUnauthenticated) {
      dispatch(changeCurrentUserConnected(false));
      dispatch(changeCurrentUserLogin(null));
      dispatch(changeCurrentUserWallet(null));
      dispatch(changeCurrentUserisAdmin(null));
      dispatch(changeCurrentUserMatch(null));
      dispatch(changeCurrentUserId(null));

      sessionStorage.setItem("currentWallet", "");
      return;
    }

    const user = session?.data?.user as CustomSession["user"];
    const isSameGithubAccount = user.login === state.currentUser?.login;
    const isSameWallet = AddressValidator.compare(user.address, state.currentUser?.walletAddress);

    if (user.accountsMatch !== state.currentUser?.match)
      dispatch(changeCurrentUserMatch(user.accountsMatch));

    if (!user || isSameGithubAccount && isSameWallet)
      return;

    if (!isSameGithubAccount) {
      dispatch(changeCurrentUserLogin(user.login));
    }

    if (!isSameWallet) {
      const isAdmin = user.roles.includes(UserRole.ADMIN);

      dispatch(changeCurrentUserId(user.id));
      dispatch(changeCurrentUserWallet(user.address));
      dispatch(changeCurrentUserisAdmin(isAdmin));

      sessionStorage.setItem("currentWallet", user.address);
    }

    await connect();

    dispatch(changeCurrentUserConnected(true));

    pushAnalytic(EventName.USER_LOGGED_IN, { login: user.login });
  }

  function verifyReAuthorizationNeed() {
    const expirationStorage = new WinStorage(SESSION_EXPIRATION_KEY, 0);

    dispatch(changeReAuthorizeGithub(!!expirationStorage.value && new Date(expirationStorage.value) < new Date()));
  }

  function signMessage(message?: string) {
    return new Promise<string>(async (resolve, reject) => {
      if (!state?.currentUser?.walletAddress ||
          !connectedChain?.id ||
          serviceStarting ||
          isLoadingSigningMessage) {
        reject("Wallet not connected, service not started or already signing a message");
        return;
      }

      const currentWallet = state?.currentUser?.walletAddress?.toLowerCase();
      const isAdminUser = currentWallet === publicRuntimeConfig?.adminWallet?.toLowerCase();

      if (!isAdminUser && connectedChain?.name === UNSUPPORTED_CHAIN) {
        addWarning("Unsupported chain", "To sign a message, connect to a supported chain");

        reject("Unsupported chain");
        return;
      }

      const messageToSign = message || (isAdminUser ? IM_AN_ADMIN : NOT_AN_ADMIN);

      const storedSignature = sessionStorage.getItem("currentSignature");

      if (decodeMessage(connectedChain?.id,
                        messageToSign,
                        storedSignature || state?.currentUser?.signature,
                        currentWallet)) {
        if (storedSignature)
          dispatch(changeCurrentUserSignature(storedSignature));
        else
          sessionStorage.setItem("currentSignature", state?.currentUser?.signature);

        resolve(storedSignature || state?.currentUser?.signature);
        return;
      }

      setIsLoadingSigningMessage(true)

      await _signMessage(messageToSign)
        .then(signature => {
          setIsLoadingSigningMessage(false)

          if (signature) {
            dispatch(changeCurrentUserSignature(signature));
            sessionStorage.setItem("currentSignature", signature);

            resolve(signature);
            return;
          }

          dispatch(changeCurrentUserSignature(undefined));
          sessionStorage.removeItem("currentSignature");

          reject("Message not signed");
          return;
        });
    });
  }

  function updateKycSession(){
    if(!state?.currentUser?.match
        || !state?.currentUser?.accessToken
        || !state?.currentUser?.walletAddress
        || !state?.Settings?.kyc?.isKycEnabled)
      return

    useGetKycSession()
      .then((data) => data.status !== 'VERIFIED' ? useValidateKycSession(data.session_id) : data)
      .then((session)=> dispatch(changeCurrentUserKycSession(session)))
  }

  return {
    signOut,
    signInWallet,
    signInGithub,
    updateWalletBalance,
    verifyReAuthorizationNeed,
    signMessage,
    updateKycSession,
    syncUserDataWithSession,
  }
}