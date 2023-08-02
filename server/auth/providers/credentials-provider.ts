import { SignTypedDataVersion, recoverTypedSignature } from "@metamask/eth-sig-util";
import { EIP4361Message } from "@taikai/dappkit";
import CredentialsProvider from "next-auth/providers/credentials";

import { ProviderOptions } from "server/auth/providers/provider";
import { UserRepository } from "server/db/repositories/user";

export const CRDProvider: ProviderOptions = {
  config: CredentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0"
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0"
      }
    },
    async authorize(credentials) {
      const signer = recoverTypedSignature<SignTypedDataVersion.V4, EIP4361Message>({
        data: JSON.parse(credentials?.message),
        signature: credentials?.signature,
        version: SignTypedDataVersion.V4
      });

      if (!signer) return null;

      return {
        id: signer
      };
    }
  }),
  callbacks: {
    async signIn({ account }) {
      const accountAddress = account?.providerAccountId;

      if (!accountAddress) return false;

      const userRepository = new UserRepository();

      const userFound = await userRepository.findUserByAddress(accountAddress);

      if (userFound) 
        return true;

      const userAdded = await userRepository.addUser({
        address: accountAddress
      });

      return !!userAdded;
    },
    async jwt(params) {
      console.log("jwt", params)

      return params;
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