export function extractNetworkAndChain(path: string) {
  if (!path)
    return {network: '', link: ''};

  const [network, ...link] = path.split("/");
  return {
    network,
    link: link.join("/")
  };
}
