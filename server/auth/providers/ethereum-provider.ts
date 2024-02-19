import { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";
import { getSiweMessage, verifySiweSignature } from "helpers/siwe";
import { lowerCaseCompare, lowerCaseIncludes } from "helpers/string";
import { AddressValidator } from "helpers/validators/address";

import { UserRole } from "interfaces/enums/roles";

import { AuthProvider } from "server/auth/providers";
import { UserRoleUtils } from "server/utils/jwt";

export const EthereumProvider = (currentToken: JWT, req: NextApiRequest): AuthProvider => ({
  config: CredentialsProvider({
    name: "Ethereum",
    credentials: {
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0"
      },
      address: {
        label: "Address",
        type: "text"
      },
      issuedAt: {
        label: "Issued at",
        type: "number"
      },
      expiresAt: {
        label: "Expires at",
        type: "number"
      },
    },
    async authorize (credentials) {
      const { signature, address, issuedAt, expiresAt } = credentials;

      const nonce = await getCsrfToken({ req: { headers: req.headers } });

      const siweMessage = getSiweMessage({
        nonce,
        address,
        issuedAt: +issuedAt,
        expiresAt: +expiresAt,
      });

      const signer = await verifySiweSignature(siweMessage, signature, nonce);

      if (!signer) return null;

      return {
        id: signer
      };
    }
  }),
  callbacks: {
    async signIn ({ account }) {
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
    async jwt ({ token }) {
      const nonce = await getCsrfToken({ req: { headers: req.headers } });

      const signature = req?.body?.signature || currentToken?.signature;
      const issuedAt = req?.body?.issuedAt || currentToken?.issuedAt;
      const expiresAt = req?.body?.expiresAt || currentToken?.expiresAt;

      const address = token?.sub;

      const roles = [UserRole.USER];

      if (AddressValidator.isAdmin(address))
        roles.push(UserRole.ADMIN);

      const networks = await models.network.findAll({
        attributes: ["creatorAddress", "networkAddress", "chain_id", "allow_list", "close_task_allow_list", "id"],
        where: {
          isClosed: false,
          isRegistered: true
        }
      });

      const { governorOf, taskRoles } = networks.reduce(({governorOf, taskRoles}, curr) => {
        if (lowerCaseCompare(curr.creatorAddress, address))
          governorOf.push(UserRoleUtils.getGovernorRole(curr.chain_id, curr.networkAddress));
        if (!curr.close_task_allow_list?.length || lowerCaseIncludes(address, curr.close_task_allow_list))
          taskRoles.push(UserRoleUtils.getCloseTaskRole(curr.id));
        if (!curr.allow_list?.length || lowerCaseIncludes(address, curr.allow_list))
          taskRoles.push(UserRoleUtils.getCreateTaskRole(curr.id));

        return {
          governorOf,
          taskRoles
        };
      }, { governorOf: [], taskRoles: [] });

      roles.push(...governorOf, ...taskRoles);

      return {
        ...token,
        ...currentToken,
        nonce,
        roles,
        address,
        signature,
        issuedAt,
        expiresAt
      };
    },
  }
});