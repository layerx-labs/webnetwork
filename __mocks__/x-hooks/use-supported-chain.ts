export const network1 = { name: "network1", networkAddress: "0x11111111" };
export const network2 = { name: "network2", networkAddress: "0x22222222" };
export const chain1 = {
  chainId: 1,
  chainName: "chain1",
  chainShortName: "chain1",
  networks: [network1]
};
export const chain2 = {
  chainId: 2,
  chainName: "chain2",
  chainShortName: "chain2",
  networks: [network1, network2]
};
export const supportedChains = [ chain1, chain2 ];

export default function () {
  return {
    supportedChains
  };
}