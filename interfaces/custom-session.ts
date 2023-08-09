import { ISODateString } from "next-auth";

export interface CustomSession extends Record<string, unknown> {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    login?: string | null;
    accessToken?: string | null;
    address?: string | null;
    roles?: string[] | null;
    accountsMatch?: boolean | null;
  };
  expires: ISODateString;
}
