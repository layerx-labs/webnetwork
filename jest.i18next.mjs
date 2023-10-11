import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import bounty from "public/locales/en/bounty.json";
import changeTokenModal from "public/locales/en/change-token-modal.json";
import common from "public/locales/en/common.json";
import connectAccount from "public/locales/en/connect-account.json";
import connectWalletButton from "public/locales/en/connect-wallet-button.json";
import council from "public/locales/en/council.json";
import customNetwork from "public/locales/en/custom-network.json";
import deliverable from "public/locales/en/deliverable.json";
import funding from "public/locales/en/funding.json";
import leaderboard from "public/locales/en/leaderboard.json";
import myOracles from "public/locales/en/my-oracles.json";
import profile from "public/locales/en/profile.json";
import proposal from "public/locales/en/proposal.json";
import pullRequest from "public/locales/en/pull-request.json";
import setup from "public/locales/en/setup.json";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",

    // have a common namespace used around the full app
    ns: ["common"],
    defaultNS: "common",

    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    resources: { 
      en: { 
        bounty,
        "change-token-modal": changeTokenModal,
        common,
        "connect-account": connectAccount,
        "connect-wallet-button": connectWalletButton,
        council,
        "custom-network": customNetwork,
        deliverable,
        funding,
        leaderboard,
        "my-oracles": myOracles,
        profile,
        proposal,
        "pull-request": pullRequest,
        setup
      }
    },
  });

export default i18n;