import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import models from "db/models";

import { caseInsensitiveEqual } from "helpers/db/conditionals";

import { UserRole } from "interfaces/enums/roles";
import { isAdminAddress } from "interfaces/validators/address";

import { siweMessageService } from "services/ethereum/siwe";

import { AuthProvider } from "server/auth/providers";

export const EthereumProvider = (currentToken: JWT, signature: string, message): AuthProvider => ({
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
      const signer = siweMessageService.getSigner(JSON.parse(credentials?.message), credentials?.signature);

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
    async jwt({ token, account }) {
      const address = token?.sub;

      const roles = [UserRole.USER];

      if (isAdminAddress(address))
        roles.push(UserRole.ADMIN);

      const governorOf = await models.network.findAllOf(address)
        .then(networks => networks.map(({ networkAddress, chain_id }) => 
          `${UserRole.GOVERNOR}:${chain_id}_${networkAddress}`))
        .catch(() => []);

      roles.push(...governorOf);

      return {
        ...currentToken,
        ...token,
        account: Object.assign({}, currentToken?.account, account),
        roles,
        address,
        message,
        signature
      };
    },
  }
});