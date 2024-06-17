import { useTranslation } from "next-i18next";
import Link from "next/link";

import { truncateAddress } from "helpers/truncate-address";

type UserProfileLinkProps = {
  address: string,
  handle?: string,
  className?: string,
  truncate?: boolean,
  transformHandle?: boolean;
}

export function UserProfileLink({
  address,
  handle,
  className,
  truncate = true,
  transformHandle = true,
}: UserProfileLinkProps) {
  const { t } = useTranslation("common");

  const renderAddress = truncate ? truncateAddress(address, 5) : address;
  const renderHandle = transformHandle && handle ? `@${handle}` : handle;

  return (
    <Link href={`/profile/${handle || address}`}>
      <span 
        className={`cursor-pointer text-decoration-underline-hover ${className}`}
        title={t("actions.go-to-user-profile")}
      >
        {renderHandle || renderAddress}
      </span>
    </Link>
  );
}