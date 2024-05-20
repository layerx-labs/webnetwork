import { SVGProps } from "react";

export default function XMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="45"
      height="44"
      viewBox="0 0 45 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_707_1540)">
        <path
          d="M34.5555 0H10.3142C4.80176 0 0.333008 4.46875 0.333008 9.98124V34.0188C0.333008 39.5312 4.80176 44 10.3142 44H34.5555C40.068 44 44.5368 39.5312 44.5368 34.0188V9.98124C44.5368 4.46875 40.068 0 34.5555 0Z"
          fill="black"
        />
        <path
          d="M28.2836 12.8079H31.402L24.5893 20.5953L32.6038 31.1913H26.3281L21.413 24.7653L15.7882 31.1913H12.6681L19.9548 22.8625L12.2666 12.8079H18.7012L23.144 18.6821L28.2836 12.8079ZM27.1888 29.3247H28.9173L17.7627 14.5769H15.9082L27.1888 29.3247Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_707_1540">
          <rect
            width="44.2038"
            height="44"
            fill="white"
            transform="translate(0.333008)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
