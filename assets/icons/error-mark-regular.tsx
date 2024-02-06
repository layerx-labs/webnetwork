import { SVGProps } from "react";

export default function ErrorMarkRegular(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.27811 5.34061C9.44896 5.16975 9.44896 4.89275 9.27811 4.72189C9.10726 4.55104 8.83024 4.55104 8.65939 4.72189L7 6.38128L5.34061 4.72189C5.16975 4.55104 4.89275 4.55104 4.72189 4.72189C4.55104 4.89275 4.55104 5.16975 4.72189 5.34061L6.38128 7L4.72189 8.65939C4.55104 8.83024 4.55104 9.10726 4.72189 9.27811C4.89275 9.44896 5.16975 9.44896 5.34061 9.27811L7 7.61872L8.65939 9.27811C8.83024 9.44896 9.10726 9.44896 9.27811 9.27811C9.44896 9.10726 9.44896 8.83024 9.27811 8.65939L7.61872 7L9.27811 5.34061Z"
        fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M7 11.8125C9.65787 11.8125 11.8125 9.65787 11.8125 7C11.8125 4.34213 9.65787 2.1875 7 2.1875C4.34213 2.1875 2.1875 4.34213 2.1875 7C2.1875 9.65787 4.34213 11.8125 7 11.8125ZM7 12.6875C10.1411 12.6875 12.6875 10.1411 12.6875 7C12.6875 3.85888 10.1411 1.3125 7 1.3125C3.85888 1.3125 1.3125 3.85888 1.3125 7C1.3125 10.1411 3.85888 12.6875 7 12.6875Z"
            fill="currentColor"/>
    </svg>

  );
}