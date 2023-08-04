import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Account, Profile } from "next-auth";
import { getToken } from "next-auth/jwt";
import getConfig from "next/config";

import models from "db/models";

import { DAY_IN_SECONDS } from "helpers/constants";
import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { toLower } from "helpers/string";

import { Logger } from "services/logging";

import { EthereumProvider, GHProvider } from "server/auth/providers";

const {
  publicRuntimeConfig,
  serverRuntimeConfig: {
    auth: {
      secret
    }
  }
} = getConfig();

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const currentToken = await getToken({ req, secret: secret });

  return NextAuth(req, res, {
    providers: [
      EthereumProvider,
      GHProvider
    ],
    pages: {
      signIn: "/auth/signin"
    },
    session:{
      strategy: "jwt",
      maxAge: 30 * DAY_IN_SECONDS
    },
    callbacks: {
      async signIn({ profile, account}) {
        try {
          const provider = account?.provider;

          if (provider === "github") {
            if (!profile?.login) return "/?authError=Profile not found";

            return true;
          } else if (provider === "credentials") {
            const accountAddress = account?.providerAccountId;

            if (accountAddress) {
              await models.user.findOrCreate({
                where: {
                  address: caseInsensitiveEqual("address", accountAddress.toLowerCase())
                },
                defaults: {
                  address: accountAddress
                }
              });
  
              return true;
            }
          }
        } catch(error) {
          Logger.error(error, "SignIn callback: ");
        }

        return false;
      },
      async jwt({ token, profile, account }) {
        try {
          const provider = account?.provider;
          
          if (provider === "github") {
            const { name, login } = profile;
            const { provider, access_token } = account;

            return { 
              ...token, 
              profile: {
                name,
                login,
              },
              account: {
                provider,
                access_token
              }, 
              address: currentToken?.address,
              role: currentToken?.role,
            };
          } else if (provider === "credentials") {
            const address = token?.sub;

            let role = "user";
      
            if (address && toLower(address) === toLower(publicRuntimeConfig?.adminWallet))
              role = "governor";
      
            return {
              ...currentToken,
              ...token,
              account: {
                ...(currentToken?.account as Account),
                ...account
              },
              role,
              address
            };
          }
        } catch(error) {
          Logger.error(error, "JWT callback: ");
        }
  
        return token;
      },
      async session({ session, token }) {
        const { login, name } = (token?.profile || {}) as Profile;
        const accessToken = (token?.account as Account)?.access_token;
        const { role, address } = token;

        return {
          expires: session.expires,
          user: {
            login,
            name,
            accessToken,
            role,
            address,
          },
        };
      },
    },
  });
}
