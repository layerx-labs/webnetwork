import { WhereOptions } from "sequelize";

export function getAssociation(association: string,
                               attributes: string[] = undefined, 
                               required = false, 
                               where: WhereOptions = {}) {
  return {
    association,
    attributes,
    required,
    where,
  };
}