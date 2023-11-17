import {useRouter} from "next/router";

import useMarketplace from "x-hooks/use-marketplace";

export default function ReadOnlyContainer({ children }) {
  const { pathname } = useRouter();
  
  const marketplace = useMarketplace();

  const isOnNetwork = pathname?.includes("[network]");

  return(
    <div className={`${marketplace?.active?.isClosed && isOnNetwork ? "read-only-network" : ""}`}>
      {children}
    </div>
  );
}