import { SVGProps } from "react";

export default function ExpertHelpIcon (props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="257" height="135" viewBox="0 0 257 135" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#expert-clip0_1299_16671)">
        <path
          d="M128 86.5C129.657 86.5 131 85.1569 131 83.5C131 81.8431 129.657 80.5 128 80.5C126.343 80.5 125 81.8431 125 83.5C125 85.1569 126.343 86.5 128 86.5Z"
          fill={props?.color || "white"}/>
        <path
          d="M128 73.25V70.375C134.35 70.375 139.5 65.8684 139.5 60.3125C139.5 54.7566 134.35 50.25 128 50.25C121.65 50.25 116.5 54.7566 116.5 60.3125V61.75"
          stroke={props?.color || "white"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path
          d="M128 102C147.054 102 162.5 86.5538 162.5 67.5C162.5 48.4462 147.054 33 128 33C108.946 33 93.5 48.4462 93.5 67.5C93.5 86.5538 108.946 102 128 102Z"
          stroke={props?.color || "white"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <path opacity="0.2"
            d="M0.5 210.903C36.1224 210.903 65 176.959 65 135.087C65 93.2154 36.1224 59.2715 0.5 59.2715C-35.1224 59.2715 -64 93.2154 -64 135.087C-64 176.959 -35.1224 210.903 0.5 210.903Z"
            stroke="url(#expert-paint0_linear_1299_16671)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path opacity="0.2"
            d="M60.5 35.7624C96.1224 35.7624 125 1.81855 125 -40.0534C125 -81.9253 96.1224 -115.869 60.5 -115.869C24.8776 -115.869 -4 -81.9253 -4 -40.0534C-4 1.81855 24.8776 35.7624 60.5 35.7624Z"
            stroke="url(#expert-paint1_linear_1299_16671)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path opacity="0.2"
            d="M197.5 252.044C233.122 252.044 262 218.1 262 176.228C262 134.356 233.122 100.412 197.5 100.412C161.878 100.412 133 134.356 133 176.228C133 218.1 161.878 252.044 197.5 252.044Z"
            stroke="url(#expert-paint2_linear_1299_16671)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path opacity="0.2"
            d="M255.5 76.9031C291.122 76.9031 320 42.9592 320 1.08727C320 -40.7846 291.122 -74.7285 255.5 -74.7285C219.878 -74.7285 191 -40.7846 191 1.08727C191 42.9592 219.878 76.9031 255.5 76.9031Z"
            stroke="url(#expert-paint3_linear_1299_16671)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="expert-paint0_linear_1299_16671" x1="0.5" y1="59.2715" x2="0.5" y2="134.5"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="expert-paint1_linear_1299_16671" x1="60.5" y1="0.499272" x2="60.5" y2="35.7624"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0"/>
          <stop offset="1" stopColor="white"/>
        </linearGradient>
        <linearGradient id="expert-paint2_linear_1299_16671" x1="197.5" y1="100.412" x2="197.5" y2="135.088"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="expert-paint3_linear_1299_16671" x1="255.5" y1="-2.43904" x2="255.5" y2="76.9031"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0"/>
          <stop offset="1" stopColor="white"/>
        </linearGradient>
        <clipPath id="expert-clip0_1299_16671">
          <rect width="92" height="92" fill="white" transform="translate(82 21.5)"/>
        </clipPath>
      </defs>
    </svg>
  );
}
