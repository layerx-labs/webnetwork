import { useState } from "react";

import { Web3Connection } from "@taikai/dappkit";
import BigNumber from "bignumber.js";
import { getCsrfToken, signIn as nextSignIn, signOut as nextSignOut, useSession } from "next-auth/react";
import getConfig from "next/config";
import { useRouter } from "next/router";

import { IM_AN_ADMIN, NOT_AN_ADMIN, UNSUPPORTED_CHAIN } from "helpers/constants";
import decodeMessage from "helpers/decode-message";
import { AddressValidator } from "helpers/validators/address";
import { getProviderNameFromConnection } from "helpers/wallet-providers";

import { EventName } from "interfaces/analytics";
import { CustomSession } from "interfaces/custom-session";
import { UserRole } from "interfaces/enums/roles";
import { StorageKeys } from "interfaces/enums/storage-keys";

import { WinStorage } from "services/win-storage";

import { SESSION_TTL } from "server/auth/config";

import { useSearchCurators } from "x-hooks/api/curator";
import { useGetKycSession, useValidateKycSession } from "x-hooks/api/kyc";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useAnalyticEvents from "x-hooks/use-analytic-events";
import { useDao } from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import { useSettings } from "x-hooks/use-settings";
import useSignature from "x-hooks/use-signature";
import { useStorageTransactions } from "x-hooks/use-storage-transactions";
import useSupportedChain from "x-hooks/use-supported-chain";

export const SESSION_EXPIRATION_KEY =  "next-auth.expiration";

const { publicRuntimeConfig } = getConfig();

export function useAuthentication() {
  const session = useSession();
  const { asPath } = useRouter();

  const [isLoadingSigningMessage, setIsLoadingSigningMessage] = useState(false);

  const { settings } = useSettings();
  const marketplace = useMarketplace();
  const { connect, disconnect } = useDao();
  const { pushAnalytic } = useAnalyticEvents();
  const transactions = useStorageTransactions();
  const { connectedChain } = useSupportedChain();
  const { signMessage: _signMessage, signInWithEthereum } = useSignature();

  const { addWarning } = useToastStore();
  const { currentUser, updateCurrentUser} = useUserStore();
  const { service: daoService, serviceStarting } = useDaoStore();
  const { updateWalletSelectorModal } = useLoadersStore();

  const [balance] = useState(new WinStorage('currentWalletBalance', 1000, 'sessionStorage'));

  const URL_BASE = typeof window !== "undefined" ? `${window.location.protocol}//${ window.location.host}` : "";

  function signOut(redirect?: string) {
    const expirationStorage = new WinStorage(SESSION_EXPIRATION_KEY, 0);

    expirationStorage.removeItem();
    transactions.deleteFromStorage();

    disconnect();

    nextSignOut({
      callbackUrl: `${URL_BASE}/${redirect || ""}`
    });
  }

  async function signInWallet(connection: Web3Connection) {
    const address = await connection.getAddress();

    if (!address) return;

    const providerName = getProviderNameFromConnection(connection);
    window.localStorage.setItem(StorageKeys.lastProviderConnected, providerName);

    const csrfToken = await getCsrfToken();

    const issuedAt = new Date();
    const expiresAt = new Date(+issuedAt + SESSION_TTL);

    const signature = await signInWithEthereum(csrfToken, address, issuedAt, expiresAt, connection);

    if (!signature) return;

    updateWalletSelectorModal(false);

    nextSignIn("credentials", {
      redirect: false,
      signature,
      issuedAt: +issuedAt,
      expiresAt: +expiresAt,
      callbackUrl: `${URL_BASE}${asPath}`
    });
  }

  function updateWalletBalance(force = false) {
    if ((!force && (balance.value || !currentUser?.walletAddress)) || !daoService?.network)
      return;

    const update = newBalance => {
      const newState = Object.assign(currentUser.balance || {}, newBalance);
      updateCurrentUser({ balance: newState });
      balance.value = newState;
    }

    Promise.all([
      daoService.getOraclesResume(currentUser.walletAddress),
      daoService.getBalance('settler', currentUser.walletAddress),
      useSearchCurators({
        address: currentUser.walletAddress,
        networkName: marketplace?.active?.name,
        chainShortName: marketplace?.active?.chain?.chainShortName
      })
      .then(v => v?.rows[0]?.tokensLocked || 0).then(value => new BigNumber(value))
    ])
      .then(([oracles, bepro, staked]) => {
        update({oracles, bepro, staked});
      })
      .catch(error => console.debug("Failed to updateWalletBalance", error))
  }

  async function syncUserDataWithSession() {
    if (session?.status === "loading") return;

    const isUnauthenticated = session?.status === "unauthenticated";

    if (isUnauthenticated) {
      updateCurrentUser({
        connected: false,
        login: null,
        walletAddress: null,
        isAdmin: null,
        match: null,
        id: null
      })

      sessionStorage.setItem("currentWallet", "");
      return;
    }
    const user = session?.data?.user as CustomSession["user"];
    const isSameGithubAccount = user.login === currentUser?.login;
    const isSameWallet = AddressValidator.compare(user.address, currentUser?.walletAddress);

    if (user.language !== currentUser?.language)
      updateCurrentUser({language: user.language})

    if (user.accountsMatch !== currentUser?.match)
      updateCurrentUser({match: user.accountsMatch})

    if (!user || isSameGithubAccount && isSameWallet)
      return;

    if (!isSameGithubAccount) {
      updateCurrentUser({ login: user.login })
    }

    if (!isSameWallet) {
      const isAdmin = user.roles.includes(UserRole.ADMIN);
      updateCurrentUser({
        id: user.id,
        walletAddress: user.address,
        isAdmin: isAdmin,
        notifications: user.notifications
      })

      sessionStorage.setItem("currentWallet", user.address);
    }

    await connect();

    updateCurrentUser({connected: true});

    pushAnalytic(EventName.USER_LOGGED_IN, { login: user.login });
  }

  function signMessage(message?: string) {
    return new Promise<string>(async (resolve, reject) => {
      if (!currentUser?.walletAddress ||
          !connectedChain?.id ||
          serviceStarting ||
          isLoadingSigningMessage) {
        reject("Wallet not connected, service not started or already signing a message");
        return;
      }

      const currentWallet = currentUser?.walletAddress?.toLowerCase();
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
                        storedSignature || currentUser?.signature,
                        currentWallet)) {
        if (storedSignature)
          updateCurrentUser({signature: storedSignature})
        else
          sessionStorage.setItem("currentSignature", currentUser?.signature);

        resolve(storedSignature || currentUser?.signature);
        return;
      }

      setIsLoadingSigningMessage(true)

      await _signMessage(messageToSign)
        .then(signature => {
          setIsLoadingSigningMessage(false)

          if (signature) {
            updateCurrentUser({signature})
            sessionStorage.setItem("currentSignature", signature);

            resolve(signature);
            return;
          }

          updateCurrentUser({signature: undefined})
          sessionStorage.removeItem("currentSignature");

          reject("Message not signed");
          return;
        });
    });
  }

  function updateKycSession(){
    if(!currentUser?.match
        || !currentUser?.accessToken
        || !currentUser?.walletAddress
        || !settings?.kyc?.isKycEnabled)
      return

    useGetKycSession()
      .then((data) => data.status !== 'VERIFIED' ? useValidateKycSession(data.session_id) : data)
      .then((session)=> updateCurrentUser({kycSession: session}));
  }

  return {
    signOut,
    signInWallet,
    updateWalletBalance,
    signMessage,
    updateKycSession,
    syncUserDataWithSession,
  }
}