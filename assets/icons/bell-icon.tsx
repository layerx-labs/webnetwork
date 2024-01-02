import { SVGProps } from "react";

export default function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.8625 10.9963C13.5156 10.3988 13 8.70813 13 6.5C13 5.17392 12.4732 3.90215 11.5355 2.96447C10.5979 2.02678 9.32608 1.5 8 1.5C6.67392 1.5 5.40215 2.02678 4.46447 2.96447C3.52678 3.90215 3 5.17392 3 6.5C3 8.70875 2.48375 10.3988 2.13688 10.9963C2.04829 11.1482 2.00133 11.3207 2.00073 11.4966C2.00013 11.6724 2.0459 11.8453 2.13344 11.9978C2.22097 12.1503 2.34718 12.277 2.49932 12.3652C2.65146 12.4534 2.82416 12.4999 3 12.5H5.55063C5.66598 13.0645 5.97277 13.5718 6.41908 13.9361C6.8654 14.3004 7.42386 14.4994 8 14.4994C8.57614 14.4994 9.1346 14.3004 9.58092 13.9361C10.0272 13.5718 10.334 13.0645 10.4494 12.5H13C13.1758 12.4998 13.3484 12.4532 13.5005 12.365C13.6525 12.2768 13.7786 12.15 13.8661 11.9975C13.9536 11.845 13.9993 11.6722 13.9986 11.4964C13.998 11.3206 13.9511 11.1481 13.8625 10.9963ZM8 13.5C7.68989 13.4999 7.38743 13.4037 7.13425 13.2246C6.88107 13.0455 6.68962 12.7924 6.58625 12.5H9.41375C9.31038 12.7924 9.11893 13.0455 8.86575 13.2246C8.61257 13.4037 8.31011 13.4999 8 13.5ZM3 11.5C3.48125 10.6725 4 8.755 4 6.5C4 5.43913 4.42143 4.42172 5.17157 3.67157C5.92172 2.92143 6.93913 2.5 8 2.5C9.06087 2.5 10.0783 2.92143 10.8284 3.67157C11.5786 4.42172 12 5.43913 12 6.5C12 8.75313 12.5175 10.6706 13 11.5H3Z"
        fill="#F1F1F4"
      />
    </svg>
  );
}