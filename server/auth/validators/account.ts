import models from "db/models";

import {lowerCaseCompare} from "helpers/string";
import {AddressValidator} from "helpers/validators/address";

import {MatchAccountsStatus} from "interfaces/enums/api";

export async function matchAddressAndGithub(address: string, handle: string): Promise<MatchAccountsStatus | null> {
  if (!address || !handle) return null;

  const [userByAddress, userByLogin] = await Promise.all([
    models.user.findByAddress(address),
    models.user.findByhandle(handle)
  ]);

  if (!userByAddress?.handle && !userByLogin?.address)
    return null;

  if (userByAddress && lowerCaseCompare(userByAddress?.handle, handle) ||
      userByLogin && AddressValidator.compare(userByLogin.address, address))
    return MatchAccountsStatus.MATCH;

  return MatchAccountsStatus.MISMATCH;
}

export const AccountValidator = {
  matchAddressAndGithub
}