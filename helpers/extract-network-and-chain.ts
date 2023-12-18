export function extractNetworkAndChain(path: string) {

  const regex = /^(?:\/)?([^/]+)\/([^/]+)(\/task.*)/;

  const match = path?.match(regex);

  if (match) {
    const network = match[1];
    const chain = match[2];
    const link = match[3];

    return {
      network,
      chain,
      link
    };

  } else return {
    network: '',
    chain: '',
    link: ''
  };
}
