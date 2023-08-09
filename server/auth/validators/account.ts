import models from "db/models";

import { toLower } from "helpers/string";
import { AddressValidator } from "helpers/validators/address";

export enum MatchAccountsStatus {
  MATCH = "match",
  MISMATCH = "mismatch"
}

export async function matchAddressAndGithub(address: string, githubLogin: string): Promise<MatchAccountsStatus | null> {
  if (!address || !githubLogin) return null;

  const [userByAddress, userByLogin] = await Promise.all([
    models.user.findByAddress(address),
    models.user.findByGithubLogin(githubLogin)
  ]);

  if (!userByAddress && !userByLogin)
    return null;

  const isSameLogin = (login, loginToCompare) => toLower(login) === toLower(loginToCompare);

  if (userByAddress && isSameLogin(userByAddress?.githubLogin, githubLogin) ||
      userByLogin && AddressValidator.compare(userByLogin.address, address))
    return MatchAccountsStatus.MATCH;

  return MatchAccountsStatus.MISMATCH;
}

export const AccountValidator = {
  matchAddressAndGithub
}