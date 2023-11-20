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
}

export default function NetworkLogo({
  src,
  isBepro = false,
  size = "md",
  noBg,
  shape = "circle",
  bgColor,
  ...props
}: NetworkLogoProps) {
  const sizes = {
    sm: 15,
    md: 24
  };
  const roundedClass = {
    circle: "rounded-circle",
    square: "rounded",
  };
  const bgClass = `bg-${bgColor || "dark"}`;

  return (
    <div className={
      `${noBg ? "p-0" : `${bgClass} p-1`} d-flex border border-gray-800
        align-items-center justify-content-center ${roundedClass[shape]}`
    }>
      {isBepro ? (
        <BeProBlue width={sizes[size]} height={sizes[size]} />
      ) : (
        <img src={src} {...props} width={sizes[size]} height={sizes[size]} />
      )}
    </div>
  );
}
