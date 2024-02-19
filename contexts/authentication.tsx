import { ReactNode, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";

import { useAuthentication } from "x-hooks/use-authentication";

interface AuthenticationProviderProps {
  children?: ReactNode;
}
export function AuthenticationProvider ({ children }: AuthenticationProviderProps) {
  const session = useSession();
  const account = useAccount();

  const [isSigning, setIsSigning] = useState(false);

  const { signInWallet } = useAuthentication();

  useEffect(() => {
    const isWalletConnected =  account?.status === "connected";
    const isUnauthenticated = session?.status === "unauthenticated";
    if (!isWalletConnected || !isUnauthenticated || isSigning)
      return;
    signInWallet()
      .finally(() => setIsSigning(false));
  }, [session?.status, account?.status]);
  
  return(
    <>
      {children}
    </>
  );
}