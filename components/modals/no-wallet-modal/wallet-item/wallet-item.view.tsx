import { ReactNode } from "react";

import { ExternalLink } from "components/external-link";

interface WalletItemProps {
  label: string;
  link: string;
  icon: ReactNode;
}

export default function WalletItem ({
  label,
  link,
  icon,
}: WalletItemProps) {
  return (
    <div className="col-12 col-lg">
      <div className="row justify-content-center">
        {icon}
      </div>

      <div className="row justify-content-center">
        <ExternalLink
          label={label}
          href={link}
        />
      </div>
    </div>
  );
}