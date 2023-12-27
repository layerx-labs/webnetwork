import { IncomingMessage } from "http";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export default async function customServerSideTranslations (req: IncomingMessage & {
                                                              cookies: NextApiRequestCookies
                                                            },
                                                            defaultLocale: string,
                                                            namespacesRequired?: string | string[] | undefined) {
  const userLocale = (req?.cookies || {})["next-i18next-locale"];
  return serverSideTranslations(userLocale || defaultLocale, namespacesRequired);
}