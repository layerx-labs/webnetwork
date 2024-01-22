import Badge from "components/badge";

import { SupportedChainData } from "interfaces/supported-chain-data";

interface ChainBadgeProps {
  chain: Partial<SupportedChainData>;
  transparent?: boolean;
}

export default function ChainBadge({
  chain,
  transparent
} : ChainBadgeProps) {
  const badgeProps = transparent ? {
    className: "caption-small font-weight-normal px-0 bg-transparent text-gray-500 border border-gray-850"
  } : {
    className: "caption-small font-weight-normal",
    style: {
      backgroundColor: `${chain?.color}90`
    }
  };

  return(
    <Badge
      label={chain?.chainShortName}
      {...badgeProps}
    />
  );
}