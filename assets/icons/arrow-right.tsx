import { SVGProps } from "react";

export default function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      color="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.63683 0.876762C3.43626 0.67619 3.43626 0.351 3.63683 0.150428C3.83741 -0.0501436 4.1626 -0.0501436 4.36317 0.150428L7.84957 3.63683C8.05014 3.8374 8.05014 4.1626 7.84957 4.36317L4.36317 7.84957C4.1626 8.05014 3.8374 8.05014 3.63683 7.84957C3.43626 7.649 3.43626 7.32381 3.63683 7.12324L6.24647 4.5136L0.513596 4.5136C0.229945 4.5136 3.24894e-07 4.28365 3.49691e-07 4C3.74489e-07 3.71635 0.229945 3.4864 0.513596 3.4864L6.24647 3.4864L3.63683 0.876762Z"
        fill="currentColor"
      />
    </svg>
  );
}
