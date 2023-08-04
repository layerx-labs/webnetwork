import { SignTypedDataVersion, recoverTypedSignature } from "@metamask/eth-sig-util";
import { EIP4361Message } from "@taikai/dappkit";
import { TypedDataV4 } from "@taikai/dappkit";
import { Web3Connection } from "@taikai/dappkit";
import { eip4361Params } from "@taikai/dappkit";
import { EIP4361TypedData } from "@taikai/dappkit";
import getConfig from "next/config";

import { EthereumMessage } from "./message";

const { publicRuntimeConfig } = getConfig();

interface GetMessageParams {
  nonce: string;
  issuedAt: number | Date;
  expiresAt: number | Date;
}

export class SiweMessage extends EthereumMessage<EIP4361TypedData> {
  private readonly domain: string;
  private readonly statement: string;

  constructor(domain: string, statement: string, contractName: string) {
    super(contractName);
    this.domain = domain;
    this.statement = statement;
  }

  getMessage({ nonce, issuedAt, expiresAt }: GetMessageParams): EIP4361TypedData  {
    const issued = new Date(issuedAt).toISOString();
    const expires = new Date(expiresAt).toISOString();

    return eip4361Params( this.domain,
                          "",
                          this.statement,
                          this.domain,
                          "1.0",
                          "",
                          nonce,
                          issued,
                          expires,
                          issued,
                          "",
                          [],
                          this.contractName);
  }
}

export const siweMessageService  = 
  new SiweMessage(publicRuntimeConfig?.urls?.home, "Sign in with Ethereum", "Bepro Network");