import {CSSProperties} from "react";

import BeProBlue from "assets/icons/bepro-blue";

import { SizeOptions } from "interfaces/utils";

interface NetworkLogoProps {
  src: string;
  alt?: string;
  isBepro?: boolean;
  size?: SizeOptions;
  noBg?: boolean;
  bgColor?: string;
  shape?: "circle" | "square";
  className?: string;
}

export default function NetworkLogo({
  src,
  isBepro = false,
  size = "md",
  noBg,
  shape = "circle",
  bgColor,
  className,
  ...props
}: NetworkLogoProps) {
  const sizes = {
    sm: 15,
    md: 24,
    lg: 32
  };
  const roundedClass = {
    circle: "rounded-circle",
    square: "border-radius-8",
  };
  const bgClass = `bg-${bgColor || "dark"}`;

  return (
    <div
      className={
        `${noBg ? "p-0" : `${bgClass} p-1`} d-flex border border-gray-800
          align-items-center justify-content-center ${roundedClass[shape]} ${className}`
      }
    >
      {isBepro ? (
        <BeProBlue width={sizes[size]} height={sizes[size]} />
      ) : (
        <img src={src} {...props} width={sizes[size]} height={sizes[size]} className={roundedClass[shape]} />
      )}
    </div>
  );
}
