export const QueryKeys = {
  bounty: (bountyId: string) => ["bounty", bountyId],
  bountyComments: (bountyId: string) => ["bounty", bountyId, "comments"],
  proposal: (proposalId: string) => ["proposal", proposalId],
  proposalComments: (proposalId: string) => ["proposal", proposalId, "comments"],
  deliverable: (deliverableId: string) => ["deliverable", deliverableId],
  deliverableComments: (deliverableId: string) => ["deliverable", deliverableId, "comments"],
  chains: () => ["supportedChains"],
  network: (networkAddress: string, chainId: string) => ["network", networkAddress, chainId],
  networksByChain: (chainId: string) => ["networks", chainId],
  networksByGovernor: (governorAddress: string, chainId: string) => ["network", governorAddress, chainId],
  networkDefault: () => ["network", "default"],
  tokensByChain: (chainId: string) => ["tokens", chainId],
  tokensOf: (wallet: string) => ["tokens", wallet],
  votingPowerOf: (wallet: string) => ["voting-power-multi", wallet],
  votingPowerMultiOf: (wallet: string) => ["voting-power-multi", wallet],
  pricesByCoingecko: (tokens: {address: string, chainId: number}[]) => ['price', ...tokens?.map(v => v.address)]
};