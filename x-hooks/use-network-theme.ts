import {useRouter} from "next/router";

import {hexadecimalToRGB} from "helpers/colors";

import {ThemeColors} from "interfaces/network";

import useMarketplace from "x-hooks/use-marketplace";

export default function useNetworkTheme() {
  const router = useRouter();

  const { active: activeMarketplace } = useMarketplace();

  function DefaultTheme(): ThemeColors {
    return {
      primary: getComputedStyle(document.documentElement).getPropertyValue("--bs-primary").trim(),
      secondary: getComputedStyle(document.documentElement).getPropertyValue("--bs-secondary").trim(),
      oracle: getComputedStyle(document.documentElement).getPropertyValue("--bs-purple").trim(),
      text: getComputedStyle(document.documentElement).getPropertyValue("--bs-body-color").trim(),
      background: getComputedStyle(document.documentElement).getPropertyValue("--bs-body-bg").trim(),
      shadow: getComputedStyle(document.documentElement).getPropertyValue("--bs-shadow").trim(),
      gray: getComputedStyle(document.documentElement).getPropertyValue("--bs-gray").trim(),
      success: getComputedStyle(document.documentElement).getPropertyValue("--bs-success").trim(),
      danger: getComputedStyle(document.documentElement).getPropertyValue("--bs-danger").trim(),
      warning: getComputedStyle(document.documentElement).getPropertyValue("--bs-warning").trim(),
      info: getComputedStyle(document.documentElement).getPropertyValue("--bs-info").trim(),
      dark: getComputedStyle(document.documentElement).getPropertyValue("--bs-dark").trim(),
    };
  }

  function colorsToCSS(overrideColors = undefined as ThemeColors): string {
    if (!activeMarketplace || (!activeMarketplace?.colors && !overrideColors)) return "";

    const colors = {
      text: overrideColors?.text || activeMarketplace.colors?.text,
      background: overrideColors?.background || activeMarketplace.colors?.background,
      shadow: overrideColors?.shadow || activeMarketplace.colors?.shadow,
      gray: overrideColors?.gray || activeMarketplace.colors?.gray,
      primary: overrideColors?.primary || activeMarketplace.colors?.primary,
      secondary: overrideColors?.secondary || activeMarketplace.colors?.secondary,
      oracle: overrideColors?.oracle || activeMarketplace.colors?.oracle,
      success: overrideColors?.success || activeMarketplace.colors?.success,
      danger: overrideColors?.danger || activeMarketplace.colors?.danger,
      warning: overrideColors?.warning || activeMarketplace.colors?.warning,
      info: overrideColors?.info || activeMarketplace.colors?.info,
      dark: overrideColors?.dark || activeMarketplace.colors?.dark,
    };

    return `:root {
      --bs-bg-opacity: 1;
      ${
        (colors.gray &&
          `--bs-gray: ${colors.gray}; --bs-gray-rgb: ${hexadecimalToRGB(colors.gray).join(",")};`) ||
        ""
      }
      ${
        (colors.danger &&
          `--bs-danger: ${colors.danger}; --bs-danger-rgb: ${hexadecimalToRGB(colors.danger).join(",")};`) ||
        ""
      }
      ${
        (colors.shadow &&
          `--bs-shadow: ${colors.shadow}; --bs-shadow-rgb: ${hexadecimalToRGB(colors.shadow).join(",")};`) ||
        ""
      }
      ${
        (colors.oracle &&
          `--bs-purple: ${colors.oracle}; --bs-purple-rgb: ${hexadecimalToRGB(colors.oracle).join(",")};`) ||
        ""
      }
      ${
        (colors.text &&
          `--bs-body-color: ${
            colors.text
          }; --bs-body-color-rgb: ${hexadecimalToRGB(colors.text).join(",")};`) ||
        ""
      }
      ${
        (colors.primary &&
          `--bs-primary: ${
            colors.primary
          }; --bs-primary-rgb: ${hexadecimalToRGB(colors.primary).join(",")};`) ||
        ""
      }
      ${
        (colors.success &&
          `--bs-success: ${
            colors.success
          }; --bs-success-rgb: ${hexadecimalToRGB(colors.success).join(",")};`) ||
        ""
      }
      ${
        (colors.warning &&
          `--bs-warning: ${
            colors.warning
          }; --bs-warning-rgb: ${hexadecimalToRGB(colors.warning).join(",")};`) ||
        ""
      }
      ${
        (colors.secondary &&
          `--bs-secondary: ${
            colors.secondary
          }; --bs-secondary-rgb: ${hexadecimalToRGB(colors.secondary).join(",")};`) ||
        ""
      }
      ${
        (colors.background &&
          `--bs-body-bg: ${
            colors.background
          }; --bs-body-bg-rgb: ${hexadecimalToRGB(colors.background).join(",")};`) ||
        ""
      }
      ${
        (colors.info &&
          `--bs-info: ${
            colors.info
          }; --bs-info-rgb: ${hexadecimalToRGB(colors.info).join(",")};`) ||
        ""
      }
      ${
        (colors.dark &&
          `--bs-dark: ${
            colors.dark
          }; --bs-dark-rgb: ${hexadecimalToRGB(colors.dark).join(",")};`) ||
        ""
      }
    }`;
  }

  function changeNetwork(newNetwork: string): void {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        network: newNetwork
      }
    });
  }

  return {
    colorsToCSS,
    DefaultTheme,
    setNetwork: changeNetwork
  };
}
