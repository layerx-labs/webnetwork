import { SignTypedDataVersion, recoverTypedSignature } from "@metamask/eth-sig-util";
import { EIP4361Message } from "@taikai/dappkit";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";

export const EthereumProvider: Provider = CredentialsProvider({
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
});