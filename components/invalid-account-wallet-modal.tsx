import {useTranslation} from "next-i18next";
import Image from "next/image";
import {useRouter} from "next/router";

import ErrorMarkIcon from "assets/icons/errormark-icon";
import metamaskLogo from "assets/metamask.png";

import Button from "components/button";
import Modal from "components/modal";

import {truncateAddress} from "helpers/truncate-address";

import { MatchAccountsStatus } from "interfaces/enums/api";

import { useUserStore } from "x-hooks/stores/user/user.store";
import { useAuthentication } from "x-hooks/use-authentication";

import AvatarOrIdenticon from "./avatar-or-identicon";

export default function InvalidAccountWalletModal() {
  const {asPath} = useRouter();

  const { t } = useTranslation("common");

  const { currentUser } = useUserStore();

  const { signOut } = useAuthentication();

  const show = [
    currentUser?.match === MatchAccountsStatus.MISMATCH, 
    currentUser?.login,
    currentUser?.walletAddress,
    !asPath.includes(`connect-account`)
  ].every(condition=> condition);

  function handleSignOut() {
    signOut();
  }

  return (
    <Modal
      centerTitle
      size="lg"
      show={show}
      title={t("modals.invalid-account-wallet.title")}>
      <div>
        <div className="d-flex justify-content-center mb-2 mx-2 text-center flex-column mb-4">
          <p className="caption-small text-gray">
          {t("modals.invalid-account-wallet.description")}
          </p>
        </div>

        <div className="row gx-3 connect-account">
          <div className="col-6">
            <div
              className={`button-connect border bg-dark 
                border-danger d-flex justify-content-between p-3 align-items-center`}
            >
              <div>
              <AvatarOrIdenticon
                  user={currentUser?.login || "null"}
                  address={currentUser?.walletAddress}
                  size="sm"
                />{" "}
                <span className="ms-2">{currentUser?.login}</span>
              </div>

              <ErrorMarkIcon />
            </div>
          </div>
          <div className="col-6">
            <div
              className={`button-connect border bg-dark 
                border-danger d-flex justify-content-between p-3 align-items-center`}
            >
              <div>
                <Image src={metamaskLogo} width={15} height={15} />{" "}
                <span className="ms-2">
                  {currentUser?.walletAddress && truncateAddress(currentUser?.walletAddress || '')}
                </span>
              </div>
              <ErrorMarkIcon />
            </div>
          </div>
        </div>

        <div className="row justify-content-center align-items-center mt-3">
          <div className="col-auto">
            <Button
              onClick={handleSignOut}
            >
              {t("actions.disconnect")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
