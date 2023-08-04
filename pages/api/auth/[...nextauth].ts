import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Account, Profile } from "next-auth";
import { getToken } from "next-auth/jwt";
import getConfig from "next/config";

import { DAY_IN_SECONDS } from "helpers/constants";

import { Logger } from "services/logging";

import { EthereumProvider, GHProvider } from "server/auth/providers";

const {
  serverRuntimeConfig: {
    auth: {
      secret
    }
  }
} = getConfig();

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const currentToken = await getToken({ req, secret: secret });
  const signature = req?.body?.signature || currentToken?.signature;
  const message = req?.body?.message || currentToken?.message;

  const ethereumProvider = EthereumProvider(currentToken, signature, message);
  const githubProvider = GHProvider(currentToken);

  return NextAuth(req, res, {
    providers: [
      ethereumProvider.config,
      githubProvider.config
    ],
    pages: {
      signIn: "/auth/signin"
    },
    session:{
      strategy: "jwt",
      maxAge: 30 * DAY_IN_SECONDS
    },
    callbacks: {
      async signIn(params) {
        try {
          const provider = params?.account?.provider;

          switch (provider) {
          case "github":
            return githubProvider.callbacks.signIn(params);
          
          case "credentials":
            return ethereumProvider.callbacks.signIn(params);
          
          default:
            return false;
          }
        } catch(error) {
          Logger.error(error, "SignIn callback: ");
        }

        return false;
      },
      async jwt(params) {
        try {
          const provider = params?.account?.provider;

          switch (provider) {
          case "github":
            return githubProvider.callbacks.jwt(params);
          
          case "credentials":
            return ethereumProvider.callbacks.jwt(params);
          
          default:
            return params.token;
          }
        } catch(error) {
          Logger.error(error, "JWT callback: ");
        }

        return params?.token;
      },
      async session({ session, token }) {
        const { login, name } = (token?.profile || {}) as Profile;
        const accessToken = (token?.account as Account)?.access_token;
        const { roles, address, signature, message } = token;

        return {
          expires: session.expires,
          iat: token.iat,
          exp: token.exp,
          user: {
            login,
            name,
            accessToken,
            roles,
            address,
            signature,
            message
          },
        };
      },
    },
  });
}
