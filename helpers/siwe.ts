import getConfig from "next/config";
import { SiweMessage } from 'siwe';

const { publicRuntimeConfig } = getConfig();

type GetSiweMessageProps = {
  nonce: string,
  address: string,
  issuedAt: number | Date,
  expiresAt: number | Date
}
export function getSiweMessage ({
  nonce,
  address,
  issuedAt,
  expiresAt
}: GetSiweMessageProps): SiweMessage  {
  return new SiweMessage({
    domain: publicRuntimeConfig?.urls?.home,
    address,
    statement: 'Sign in with Ethereum to the app.',
    uri: publicRuntimeConfig?.urls?.home,
    version: '1',
    chainId: 1,
    nonce,
    issuedAt: new Date(issuedAt).toISOString(),
    expirationTime: new Date(expiresAt).toISOString(),
  });
}

export async function verifySiweSignature (siwe: SiweMessage, signature: string, nonce: string): Promise<string | null> {
  const result = await siwe.verify({
    signature: signature || "",
    domain: publicRuntimeConfig?.urls?.home,
    nonce,
  })
    .catch(() => ({
      success: false
    }));

  if (result.success)
    return siwe.address;

  return null;
}