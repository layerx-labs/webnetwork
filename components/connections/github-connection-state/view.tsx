import { useTranslation } from "next-i18next";

import Button from "../../button";
import { ConnectionButton } from "../../profile/connect-button";

interface GithubConnectionStateProps {
  handleClickDisconnect?: () => void;
  connectWallet: () => void;
  userLogin: string;
  walletAddress: string;
}

export default function GithubConnectionStateView({
  userLogin,
  walletAddress,
  handleClickDisconnect,
  connectWallet,
}: GithubConnectionStateProps) {
  const { t } = useTranslation("profile");

  return (
    <>
      <div className="row">
        <div className="col-12 col-xl-4 mb-3">
          <ConnectionButton
            type="wallet"
            credential={walletAddress}
            connect={connectWallet}
          />

          {handleClickDisconnect && userLogin && walletAddress && (
            <Button
              outline
              color="danger"
              className="mt-3 col-12"
              onClick={handleClickDisconnect}
            >
              {t("actions.remove-github-account")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
