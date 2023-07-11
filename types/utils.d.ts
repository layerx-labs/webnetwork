import { UrlObject } from "url";

export interface BreakpointOptions {
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
  xxl?: boolean;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MouseEvents {
  onMouseDown: () => void;
  onTouchStart: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchEnd: () => void;
}

export interface Link {
  label: string;
  href: string | UrlObject;
}

export interface Action {
  onClick: () => void;
  label: string;
}

export interface QueryParams {
  [key: string]: string | undefined;
}

export type Direction = "vertical" | "horizontal";