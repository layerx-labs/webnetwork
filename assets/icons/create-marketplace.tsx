import { SVGProps } from "react";

export default function CreateMarketplaceIcon (props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="256" height="135" viewBox="0 0 256 135" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#create-clip0_1299_16671)">
        <path d="M128.17 73.0391H116.67V61.5391L151.17 27.0391L162.67 38.5391L128.17 73.0391Z" stroke={props?.color || "white"}
              strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M142.545 35.6641L154.045 47.1641" stroke={props?.color || "white"} strokeWidth="4" strokeLinecap="round"
              strokeLinejoin="round"/>
        <path
          d="M159.795 58.6641V90.2891C159.795 91.0516 159.492 91.7828 158.953 92.322C158.414 92.8612 157.682 93.1641 156.92 93.1641H99.4199C98.6574 93.1641 97.9262 92.8612 97.387 92.322C96.8478 91.7828 96.5449 91.0516 96.5449 90.2891V32.7891C96.5449 32.0266 96.8478 31.2953 97.387 30.7561C97.9262 30.217 98.6574 29.9141 99.4199 29.9141H131.045"
          stroke={props?.color || "white"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <path opacity="0.2"
            d="M-32.5 84.5C-32.5 81.4624 -30.0376 79 -27 79H69C72.0376 79 74.5 81.4624 74.5 84.5V125.5C74.5 128.538 72.0376 131 69 131H-27C-30.0376 131 -32.5 128.538 -32.5 125.5V84.5ZM-44.5 -11.5C-44.5 -14.5376 -42.0376 -17 -39 -17H57C60.0376 -17 62.5 -14.5376 62.5 -11.5V44.5C62.5 47.5376 60.0376 50 57 50H-39C-42.0376 50 -44.5 47.5376 -44.5 44.5V-11.5ZM178.5 -14.5C178.5 -17.5376 180.962 -20 184 -20H280C283.038 -20 285.5 -17.5376 285.5 -14.5V26.5C285.5 29.5376 283.038 32 280 32H184C180.962 32 178.5 29.5376 178.5 26.5V-14.5ZM205.5 71.5C205.5 68.4624 207.962 66 211 66H307C310.038 66 312.5 68.4624 312.5 71.5V128.5C312.5 131.538 310.038 134 307 134H211C207.962 134 205.5 131.538 205.5 128.5V71.5Z"
            stroke="url(#create-paint0_linear_1299_16671)"/>
      <defs>
        <linearGradient id="create-paint0_linear_1299_16671" x1="134" y1="4" x2="134" y2="121.5"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0"/>
          <stop offset="0.510417" stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="create-clip0_1299_16671">
          <rect width="92" height="92" fill="white" transform="translate(82.1699 15.5391)"/>
        </clipPath>
      </defs>
    </svg>
  );
}
