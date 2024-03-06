import { ReactNode, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useDao } from "x-hooks/use-dao";

interface AuthenticationProviderProps {
  children?: ReactNode;
}
export function AuthenticationProvider ({ children }: AuthenticationProviderProps) {
  const session = useSession();
  const account = useAccount();

  const [isSigning, setIsSigning] = useState(false);

  const { disconnect } = useDao();
  const { signInWallet } = useAuthentication();
  const { waitingForMessageSign } = useLoadersStore();

  const isWalletConnected =  account?.status === "connected";
  const isAuthenticated = session?.status === "authenticated";

  useEffect(() => {
    if (isSigning || !isWalletConnected || isAuthenticated) 
      return;
    if (!waitingForMessageSign) 
      disconnect(); 
    else {
      setIsSigning(true);
      signInWallet()
        .finally(() => setIsSigning(false));
    }
  }, [isWalletConnected, isAuthenticated]);
  
  return(
    <>
      {children}
    </>
  );
}