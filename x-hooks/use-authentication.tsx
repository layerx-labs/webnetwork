import { useState } from "react";

import BigNumber from "bignumber.js";
import { addDays } from "date-fns";
import { getCsrfToken, signIn as nextSignIn, signOut as nextSignOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAccount, useChains, useSignMessage, useSwitchChain } from "wagmi";

import { getSiweMessage } from "helpers/siwe";
import { AddressValidator } from "helpers/validators/address";

import { EventName } from "interfaces/analytics";
import { CustomSession } from "interfaces/custom-session";
import { UserRole } from "interfaces/enums/roles";

import { WinStorage } from "services/win-storage";

import { SESSION_TTL_IN_DAYS } from "server/auth/config";

import { useSearchCurators } from "x-hooks/api/curator";
import { useGetKycSession, useValidateKycSession } from "x-hooks/api/kyc";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useAnalyticEvents from "x-hooks/use-analytic-events";
import { useDao } from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import { useSettings } from "x-hooks/use-settings";
import { useStorageTransactions } from "x-hooks/use-storage-transactions";

export const SESSION_EXPIRATION_KEY =  "next-auth.expiration";

export function useAuthentication() {
  const chains = useChains();
  const session = useSession();
  const account = useAccount();
  const { asPath } = useRouter();
  const { switchChainAsync } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();

  const { disconnect } = useDao();
  const { settings } = useSettings();
  const marketplace = useMarketplace();
  const { pushAnalytic } = useAnalyticEvents();
  const transactions = useStorageTransactions();

  const { service: daoService } = useDaoStore();
  const { currentUser, updateCurrentUser} = useUserStore();
  const { updateWaitingForMessageSign } = useLoadersStore();

  const [balance] = useState(new WinStorage('currentWalletBalance', 1000, 'sessionStorage'));

  const URL_BASE = typeof window !== "undefined" ? `${window.location.protocol}//${ window.location.host}` : "";

  async function signOut(redirect?: string) {
    const expirationStorage = new WinStorage(SESSION_EXPIRATION_KEY, 0);

    expirationStorage.removeItem();
    transactions.deleteFromStorage();

    await disconnect();

    if (account?.connector?.name === "Coinbase Wallet") {
      const provider = await account?.connector?.getProvider();
      (provider as any)?.close();
    }

    nextSignOut({
      callbackUrl: `${URL_BASE}/${redirect || ""}`
    });
  }

  async function signInWallet() {
    try {
      const address = account?.address;

      if (!address)
        throw new Error("Missing address");

      if (!chains.find(c => +c.id === +account?.chainId)) {
        await switchChainAsync({
          chainId: chains[0]?.id
        });
      }

      const csrfToken = await getCsrfToken();
      const issuedAt = new Date();
      const expiresAt = addDays(issuedAt, SESSION_TTL_IN_DAYS);

      const siweMessage = getSiweMessage({
        nonce: csrfToken,
        address,
        issuedAt,
        expiresAt
      });

      const signature = await signMessageAsync({
        account: address,
        message: siweMessage.prepareMessage(),
      });

      await nextSignIn("credentials", {
        redirect: false,
        signature,
        address,
        issuedAt: +issuedAt,
        expiresAt: +expiresAt,
        callbackUrl: `${URL_BASE}${asPath}`
      });
    } catch (e) {
      disconnect();
    } finally {
      updateWaitingForMessageSign(false);
    }
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

    if (user.avatar !== currentUser?.avatar)
      updateCurrentUser({avatar: user.avatar})

    if (user.fullName !== currentUser?.fullName)
      updateCurrentUser({ fullName: user.fullName })

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
        notifications: user.notifications,
      })

      sessionStorage.setItem("currentWallet", user.address);
    }

    pushAnalytic(EventName.USER_LOGGED_IN, { login: user.login });
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
    updateKycSession,
    syncUserDataWithSession,
  }
}