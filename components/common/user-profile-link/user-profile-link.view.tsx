import { useTranslation } from "next-i18next";
import Link from "next/link";

import { truncateAddress } from "helpers/truncate-address";

type UserProfileLinkProps = {
  address: string,
  handle?: string,
  className?: string,
  truncate?: boolean,
}

export function UserProfileLink ({
  address,
  handle,
  className,
  truncate = true
}: UserProfileLinkProps) {
  const { t } = useTranslation("common");

  const renderAddress = truncate ? truncateAddress(address, 5) : address;
  const renderHandle = handle ? `@${handle}` : handle;

  return (
    <Link href={`/profile/${address}`}>
      <span 
        className={`cursor-pointer text-decoration-underline-hover ${className}`}
        title={t("actions.go-to-user-profile")}
      >
        {renderHandle || renderAddress}
      </span>
    </Link>
  );
}