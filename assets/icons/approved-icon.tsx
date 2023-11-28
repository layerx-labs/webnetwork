import { SVGProps } from "react";

export default function ApprovedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="19"
      height="14"
      viewBox="0 0 19 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.75 7.5L6 12.75L18 0.75"
        stroke="#35E0AD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
