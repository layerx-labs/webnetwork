import {UserRole} from "interfaces/enums/roles";

import {JwtToken} from "server/auth/types";

export class UserRoleUtils {
  static getGovernorRole(chainId: string | number, networkAddress: string) {
    return `${UserRole.GOVERNOR}:${chainId}_${networkAddress}`;
  }

  static getCreateBountyRole(networkId: number) {
    return `${UserRole.CREATE_BOUNTY}:${networkId}`;
  }

  static hasAdminRole(token: JwtToken) {
    return !!token?.roles?.includes(UserRole.ADMIN);
  }

  static hasGovernorRole(token: JwtToken) {
    return !!token?.roles?.find(role => role?.includes(UserRole.GOVERNOR));
  }

  static isGovernorOf(token: JwtToken, chainId: string, networkAddress: string) {
    return !!token?.roles?.includes(this.getGovernorRole(chainId, networkAddress));
  }

  static isGovernorOnChain(roles: string[], chainId: string) {
    return !!roles?.find(role => role?.includes(`${UserRole.GOVERNOR}:${chainId}`));
  }

  static hasCreateBountyRole(roles: string[] = [], onNetworkId: number) {
    return !onNetworkId ? false : roles.includes(UserRoleUtils.getCreateBountyRole(onNetworkId));
  }
}