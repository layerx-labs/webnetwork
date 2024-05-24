export const QueryKeys = {
  bounty: (bountyId: string) => ["bounty", bountyId],
  bountyComments: (bountyId: string) => ["bounty", bountyId, "comments"],
  proposal: (proposalId: string) => ["proposal", proposalId],
  proposalComments: (proposalId: string) => ["proposal", proposalId, "comments"],
  deliverable: (deliverableId: string) => ["deliverable", deliverableId],
  deliverableComments: (deliverableId: string) => ["deliverable", deliverableId, "comments"],
  chains: () => ["supportedChains"],
  settings: () => ["settings"],
  network: (networkAddress: string, chainId: string) => ["network", networkAddress, chainId],
  networksByChain: (chainId: string) => ["networks", chainId],
  networksByName: (networkName: string) => ["networks", networkName],
  networksByGovernor: (governorAddress: string) => ["network", governorAddress],
  networkDefault: () => ["network", "default"],
  tokensByChain: (chainId: string) => ["tokens", chainId],
  tokensOf: (wallet: string) => ["tokens", wallet],
  votingPowerOf: (wallet: string, chain?: string, network?: string) => ["voting-power-multi", wallet, chain, network],
  votingPowerMultiOf: (wallet: string) => ["voting-power-multi", wallet],
  pricesByCoingecko: (tokens: { address: string, chainId: number }[]) => ['price', ...(tokens||[]).map(v => v.address)],
  totalNetworkToken: (chain: string, network: string) => ["totalNetworkToken", chain, network],
  notifications: (address: string, page: string, read: string) => ["notifications", address, page, read],
  allowListByType: (type: string, networkId: number) => ["allow-list", type, networkId],
  wagmiConfigChains: () => ["wagmi-config-chains"],
  about: () => ["about"],
  totalPointsOfUser: (address: string) => ["points", "total", address],
  pointsEventsOfUser: (address: string) => ["points", "events", address],
  pointsBase: () => ["points", "base"],
  userSocials: () => ["user-socials"]
};