import { useState } from "react";

import { useTranslation } from "next-i18next";
import getConfig from "next/config";

import NetworkLogoAndColorsSettingsView from "components/network/settings/logo-and-colors/view";

import { psReadAsText } from "helpers/file-reader";
import { QueryKeys } from "helpers/query-keys";
import { getQueryableText, urlWithoutProtocol } from "helpers/string";

import { Color, Field, Icon, Network, Theme } from "interfaces/network";

import { useUpdateNetwork } from "x-hooks/api/marketplace";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useNetworkTheme from "x-hooks/use-network-theme";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";


const { publicRuntimeConfig } = getConfig();

const MAX_LOGOS_SIZE_LIMIT_IN_MB = 1;

const getDefaultIconValue = (hash: string) => ({
  value: {
    preview: `${publicRuntimeConfig?.urls?.ipfs}/${hash}`,
    raw: null,
  },
  validated: null,
});

interface NetworkLogoAndColorsSettingsProps {
  network: Network;
}

export default function NetworkLogoAndColorsSettings({
  network,
}: NetworkLogoAndColorsSettingsProps) {
  const {t} = useTranslation(["common", "custom-network", "bounty"]);

  const { DefaultTheme } = useNetworkTheme();

  const [hasChanges, setHasChanges] = useState(false);
  const [colors, setColors] = useState<Theme>({
    colors: network?.colors || DefaultTheme(),
    similar: [],
    black: [],
  });
  const [hasExceededSizeLimit, setHasExceededSizeLimit] = useState(false);
  const [iconLogo, setIconLogo] = useState<Field<Icon>>(getDefaultIconValue(network?.logoIcon));
  const [fullLogo, setFullLogo] = useState<Field<Icon>>(getDefaultIconValue(network?.fullLogo));

  const { currentUser } = useUserStore();
  const { mutateAsync: updateNetwork, isPending: isSavingChanges } = useReactQueryMutation({
    queryKey: QueryKeys.networksByGovernor(currentUser?.walletAddress),
    mutationFn: useUpdateNetwork,
    toastSuccess: t("custom-network:messages.refresh-the-page"),
    toastError: t("custom-network:errors.failed-to-update-network")
  });

  const isSaveChangesButtonDisabled = 
    hasExceededSizeLimit || iconLogo?.validated === false || fullLogo?.validated === false || isSavingChanges;

  async function handleSubmit () {
    if (
      hasExceededSizeLimit ||
      iconLogo?.validated === false ||
      fullLogo?.validated === false
    )
      return;

    const json = {
      colors: colors.colors,
      logoIcon: iconLogo?.value?.raw ? (await psReadAsText(iconLogo.value.raw)).toString() : undefined,
      fullLogo: fullLogo?.value?.raw ? (await psReadAsText(fullLogo.value.raw)).toString() : undefined,
      creator: currentUser.walletAddress,
      networkAddress: network.networkAddress
    };

    await updateNetwork(json);
    setHasChanges(false);
  }

  function validateSizeLimit(iconValue, logoValue) {
    const iconSize = (iconValue?.raw?.size || 0) / 1024 / 1024;
    const logoSize = (logoValue?.raw?.size || 0) / 1024 / 1024;
  
    if (logoSize + iconSize >= MAX_LOGOS_SIZE_LIMIT_IN_MB)
      return false;

    return true;
  }

  function onLogoChange(type: "icon" | "full") {
    return value => {
      const setter = {
        icon: setIconLogo,
        full: setFullLogo,
      }[type];

      const hasValidExtension = value?.raw?.type?.includes("image/svg");
      setter({ value, validated: hasValidExtension });

      const icon = type === "icon" ? value : iconLogo.value;
      const full = type === "full" ? value : fullLogo.value;
      setHasExceededSizeLimit(!validateSizeLimit(icon, full));
      setHasChanges(true);
    }
  }

  function onColorChange(color: Color) {
    setColors(previous => ({
      ...previous,
      colors: {
        ...previous.colors,
        [color.label]: color.code,
      }
    }));
    setHasChanges(true);
  }

  return(
    <NetworkLogoAndColorsSettingsView
      baseUrl={urlWithoutProtocol(publicRuntimeConfig?.urls?.api)}
      network={network}
      queryableNetworkName={network?.name ? getQueryableText(network?.name) : null}
      iconLogoField={iconLogo}
      fullLogoField={fullLogo}
      isLogosSizeTooLarge={hasExceededSizeLimit}
      networkTheme={colors}
      hasChanges={hasChanges}
      isSaveChangesButtonDisabled={isSaveChangesButtonDisabled}
      isSavingChanges={isSavingChanges}
      onColorChange={onColorChange}
      onIconLogoChange={onLogoChange("icon")}
      onFullLogoChange={onLogoChange("full")}
      onSaveChangesClick={handleSubmit}
    />
  );
}
