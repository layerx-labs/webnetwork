import { Provider } from "next-auth/providers";
import GithubProvider from "next-auth/providers/github";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

interface Profile {
  id: string;
  name: string;
  login: string;
  email: string;
  image: string;
  avatar_url: string;
}

export const GHProvider: Provider = GithubProvider({
  clientId: serverRuntimeConfig?.github?.clientId,
  clientSecret: serverRuntimeConfig?.github?.secret,
  authorization:
    "https://github.com/login/oauth/authorize?scope=read:user+user:email+repo",
  profile(profile: Profile) {
    return {
      id: profile.id,
      name: profile.name,
      login: profile.login,
      email: profile.email,
      image: profile.avatar_url,
    };
  },
});