import { CallbacksOptions } from "next-auth";
import { Provider } from "next-auth/providers";

export interface ProviderOptions {
  config: Provider;
  callbacks: Partial<CallbacksOptions>;
}
