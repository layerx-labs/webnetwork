import models from "db/models";
import User from "db/models/user";

import { caseInsensitiveEqual } from "helpers/db/conditionals";

interface AddUserModel {
  address: string;
  githubHandle?: string;
  githubLogin?: string;
}

export class UserRepository {
  async findUserByAddress(address: string): Promise<User> {
    const user = await models.user.findOne({
      where: {
        address: caseInsensitiveEqual("address", address.toLowerCase())
      }
    });

    return user;
  }

  async addUser(addUser: AddUserModel): Promise<User> {
    const user = await models.user.create(addUser);

    return user;
  }
}