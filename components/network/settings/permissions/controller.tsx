import { useState } from "react";

import NetworkPermissionsView from "./view";

interface NetworkPermissionsProps {
  domains: string[]
}

export default function NetworkPermissions({
  domains
}: NetworkPermissionsProps) {
  const [currentDomains, setCurrentDomains] = useState<string[]>(domains);

  return (
    <NetworkPermissionsView
      domain={""}
      domains={currentDomains}
      onChangeDomain={(v) => console.log("onChangeDomain", v)}
      handleAddDomain={() => console.log("handleAddDomain")}
    />
  );
}
