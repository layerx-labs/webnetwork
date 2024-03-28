import axios from "axios";
import getConfig from "next/config";

import { AddContractCast } from "server/graphql/chain-cast/mutations";

const { serverRuntimeConfig } = getConfig();

const chainCastApi = axios.create({
  baseURL: `${serverRuntimeConfig?.chainCast?.url}`
});

type AddContractCastVariables = {
  abi: string,
  address: string,
  program: string,
  type: "CUSTOM" | string, 
  startFrom: number,
  chainId: number,
}

async function addContractCast(variables: AddContractCastVariables): Promise<{ id: string }> {
  const { data } = await chainCastApi({
    url: serverRuntimeConfig?.chainCast?.url,
    method: "post",
    data: {
      query: AddContractCast,
      variables: variables
    }
  });

  if (data.errors?.length)
    throw new Error(data.errors.map(({ message }) => message).join(", "));

  return data.data.createContractCast;
}

export const ChainCastService = {
  addContractCast
};