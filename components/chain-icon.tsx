import { CSSProperties } from "react";

import getConfig from "next/config";

import QuestionMarkIcon from "assets/icons/question-mark-icon";

import If from "./If";
import ResponsiveWrapper from "./responsive-wrapper";

interface ChainIconProps {
  src?: string;
  size?: string;
  label?: string;
  responsiveLabel?: boolean;
  className?: string;
  style?: CSSProperties
}

const { publicRuntimeConfig } = getConfig();

export default function ChainIcon({
  src,
  size = "18",
  label,
  responsiveLabel = true,
  className
} : ChainIconProps) {
  const ipfsUrl = publicRuntimeConfig?.urls?.ipfs;
  const chainIcon = src && ipfsUrl ? 
    <img className={`rounded-circle ${className}`} src={`${ipfsUrl}/${src}`} height={size} width={size} /> :
    <QuestionMarkIcon height={size} width={size} />;

  return(
    <div className="d-flex align-items-center gap-1">
      {chainIcon}
      <If condition={!!label}>
        <ResponsiveWrapper xs={!responsiveLabel} sm={responsiveLabel}>
          <span className="sm-regular font-weight-normal text-gray-200 lh-1">{label}</span>
        </ResponsiveWrapper>
      </If>
    </div>
  );
}