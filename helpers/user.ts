import { truncateAddress } from "helpers/truncate-address";

import { User } from "interfaces/api";

export function getUserLabel(user: User) {
  return user?.handle || truncateAddress(user?.address);
}