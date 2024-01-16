export function extractNetworkAndChain(path: string) {
  if (!path)
    return "";

  const [network, ...link] = path.split("/");
  return {
    network,
    link: link.join("/")
  };
}
