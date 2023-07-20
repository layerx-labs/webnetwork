import { LinkProps } from "types/components";

export default function handleLinksWithoutNetwork(links: LinkProps[],
                                                  isOnNetwork: boolean) {
  return links.slice(0, isOnNetwork ? links.length : -1);
}
