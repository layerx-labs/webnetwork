import GithubProvider from "next-auth/providers/github";
import getConfig from "next/config";

import models from "db/models";

import { ProviderOptions } from "server/auth/providers/provider";

const { serverRuntimeConfig } = getConfig();

export const GHProvider: ProviderOptions = {
  config: GithubProvider({
    clientId: serverRuntimeConfig?.github?.clientId,
    clientSecret: serverRuntimeConfig?.github?.secret,
    authorization:
      "https://github.com/login/oauth/authorize?scope=read:user+user:email+repo",
    profile(profile: { id; name; login; email; avatar_url }) {
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
    async jwt({ token, account, profile }) {
      const user = await models.user.findOne({
        where: { 
          githubLogin: profile?.login || token?.login
        },
        raw: true
      })
        .catch(error => {
          console.log("JWT Callback", error)
        });

      return { ...token, ...profile, ...account, wallet: user?.address };
    },
    async session({ session, token }) {
      return {
        expires: session.expires,
        user: {
          ...session.user,
          login: token.login,
          accessToken: token?.access_token,
        },
      };
    },
  }
};