import { UserRole } from "interfaces/enums/roles";

import { JwtToken } from "server/auth/types";

export class UserRoleUtils {
  static getGovernorRole (chainId: string | number, networkAddress: string) {
    return `${UserRole.GOVERNOR}:${chainId}_${networkAddress}`;
  }

  static getCreateTaskRole (networkId: number) {
    return `${UserRole.CREATE_TASK}:${networkId}`;
  }

  static getCloseTaskRole (networkId: number) {
    return `${UserRole.CLOSE_TASK}:${networkId}`;
  }

  static hasAdminRole (token: JwtToken) {
    return !!token?.roles?.includes(UserRole.ADMIN);
  }

  static hasGovernorRole (token: JwtToken) {
    return !!token?.roles?.find(role => role?.includes(UserRole.GOVERNOR));
  }

  static isGovernorOf (token: JwtToken, chainId: string, networkAddress: string) {
    return !!token?.roles?.includes(this.getGovernorRole(chainId, networkAddress));
  }

  static isGovernorOnChain (roles: string[], chainId: string) {
    return !!roles?.find(role => role?.includes(`${UserRole.GOVERNOR}:${chainId}`));
  }

  static hasCreateTaskRole (roles: string[] = [], onNetworkId: number) {
    return !onNetworkId ? false : roles.includes(UserRoleUtils.getCreateTaskRole(onNetworkId));
  }

  static hasCloseTaskRole (roles: string[] = [], onNetworkId: number) {
    return !onNetworkId ? false : roles.includes(UserRoleUtils.getCloseTaskRole(onNetworkId));
  }
}