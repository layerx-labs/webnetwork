import { SVGProps } from "react";

export default function CreateMarketplaceMobileIcon (props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="279" height="69" viewBox="0 0 279 69" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#create-mobile-clip0_1299_16671)">
        <path d="M134 41H128V35L146 17L152 23L134 41Z" stroke={props?.color || "white"} strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"/>
        <path d="M141.5 21.5L147.5 27.5" stroke={props?.color || "white"} strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"/>
        <path
          d="M150.5 33.5V50C150.5 50.3978 150.342 50.7794 150.061 51.0607C149.779 51.342 149.398 51.5 149 51.5H119C118.602 51.5 118.221 51.342 117.939 51.0607C117.658 50.7794 117.5 50.3978 117.5 50V20C117.5 19.6022 117.658 19.2206 117.939 18.9393C118.221 18.658 118.602 18.5 119 18.5H135.5"
          stroke={props?.color || "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <path opacity="0.2"
            d="M-32.834 84C-32.834 80.9624 -30.3716 78.5 -27.334 78.5H68.666C71.7036 78.5 74.166 80.9624 74.166 84V125C74.166 128.038 71.7036 130.5 68.666 130.5H-27.334C-30.3715 130.5 -32.834 128.038 -32.834 125V84ZM-44.834 -12C-44.834 -15.0376 -42.3716 -17.5 -39.334 -17.5H56.666C59.7036 -17.5 62.166 -15.0376 62.166 -12V44C62.166 47.0376 59.7036 49.5 56.666 49.5H-39.334C-42.3715 49.5 -44.834 47.0376 -44.834 44V-12ZM178.166 -15C178.166 -18.0376 180.628 -20.5 183.666 -20.5H279.666C282.704 -20.5 285.166 -18.0376 285.166 -15V26C285.166 29.0376 282.704 31.5 279.666 31.5H183.666C180.628 31.5 178.166 29.0376 178.166 26V-15ZM205.166 71C205.166 67.9624 207.628 65.5 210.666 65.5H306.666C309.704 65.5 312.166 67.9624 312.166 71V128C312.166 131.038 309.704 133.5 306.666 133.5H210.666C207.628 133.5 205.166 131.038 205.166 128V71Z"
            stroke="url(#paint0_linear_1299_16671)"/>
      <defs>
        <linearGradient id="paint0_linear_1299_16671" x1="133.666" y1="3.5" x2="133.666" y2="121"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0"/>
          <stop offset="0.510417" stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="create-mobile-clip0_1299_16671">
          <rect width="48" height="48" fill="white" transform="translate(110 11)"/>
        </clipPath>
      </defs>
    </svg>

  );
}
