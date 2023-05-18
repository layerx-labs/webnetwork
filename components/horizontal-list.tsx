import { ReactNode } from "react";

interface HorizontalListProps {
  children?: ReactNode;
  className?: string;
}

export default function HorizontalList({
  children,
  className
}: HorizontalListProps) {
  return(
    <div className={`d-flex flex-nowrap overflow-auto ${className} overflow-noscrollbar`}>
      {children}
    </div>
  );
}