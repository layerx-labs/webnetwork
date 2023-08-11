import { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";

import models from "db/models";

import { governorRole } from "helpers/api";
import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { AddressValidator } from "helpers/validators/address";

import { UserRole } from "interfaces/enums/roles";

import { siweMessageService } from "services/ethereum/siwe";

import { AuthProvider } from "server/auth/providers";

export const EthereumProvider = (currentToken: JWT, req: NextApiRequest): AuthProvider => ({
  config: CredentialsProvider({
    name: "Ethereum",
    credentials: {
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0"
      },
      issuedAt: {
        label: "Issued at",
        type: "number"
      },
      expiresAt: {
        label: "Expires at",
        type: "number"
      }
    },
    async authorize(credentials) {      
      const { signature, issuedAt, expiresAt } = credentials;

      const nonce = await getCsrfToken({ req: { headers: req.headers } });

      const message = siweMessageService.getMessage({
        nonce,
        issuedAt: +issuedAt,
        expiresAt: +expiresAt
      });

      const signer = siweMessageService.getSigner(message, signature);

      if (!signer) return null;

      return {
        id: signer
      };
    }
  }),
  callbacks: {
    async signIn({ account }) {
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
      
      return false;
    },
    async jwt({ token }) {
      const signature = req?.body?.signature || currentToken?.signature;
      const issuedAt = req?.body?.issuedAt || currentToken?.issuedAt;
      const expiresAt = req?.body?.expiresAt || currentToken?.expiresAt;

      const address = token?.sub;

      const roles = [UserRole.USER];

      if (AddressValidator.isAdmin(address))
        roles.push(UserRole.ADMIN);

      const governorOf = await models.network.findAllOfCreatorAddress(address)
        .then(networks => networks.map(({ networkAddress, chain_id }) => governorRole(chain_id, networkAddress)))
        .catch(() => []);

      roles.push(...governorOf);

      return {
        ...token,
        ...currentToken,
        roles,
        address,
        signature,
        issuedAt,
        expiresAt
      };
    },
  }
});