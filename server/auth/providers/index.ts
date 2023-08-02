export * from "server/auth/providers/credentials-provider";
export * from "server/auth/providers/github-provider";

import { CRDProvider } from "server/auth/providers/credentials-provider";
import { GHProvider } from "server/auth/providers/github-provider";

export const providersConfigsArray = [
  CRDProvider.config,
  GHProvider.config
];

export const providersCallbacksMap = {
  credentials: CRDProvider.callbacks,
  github: GHProvider.callbacks
}