import {useEffect, useState} from "react";

import {useRouter} from "next/router";

import { isOnNetworkPath } from "helpers/network";

import useMarketplace from "x-hooks/use-marketplace";
import useNetworkTheme from "x-hooks/use-network-theme";

export default function NetworkThemeInjector() {
  const { pathname } = useRouter();
  
  const [currentColors, setCurrentColors] = useState("");

  const marketplace = useMarketplace();
  const { colorsToCSS } = useNetworkTheme();

  const isOnNetwork = isOnNetworkPath(pathname);

  useEffect(() => {
    if (marketplace?.active?.colors && isOnNetwork)
      setCurrentColors(colorsToCSS());
    else
      setCurrentColors("");
  }, [marketplace?.active?.name, pathname]);

  return (
    <>
      <style>{currentColors}</style>
    </>
  );
}
