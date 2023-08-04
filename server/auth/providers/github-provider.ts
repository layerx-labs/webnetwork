
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import getConfig from "next/config";

import { AuthProvider } from "server/auth/providers";

const { serverRuntimeConfig } = getConfig();

interface Profile {
  id: string;
  name: string;
  login: string;
  email: string;
  image: string;
  avatar_url: string;
}

export const GHProvider= (currentToken: JWT): AuthProvider => ({
  config: GithubProvider({
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
  }),
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.login) return "/?authError=Profile not found";

      return true;
    },
    async jwt({ profile, account, token }) {
      const { name, login } = profile;
      const { provider, access_token } = account;

      return {
        ...currentToken,
        ...token, 
        profile: {
          name,
          login,
        },
        account: {
          provider,
          access_token
        }
      };
    },
  }
});