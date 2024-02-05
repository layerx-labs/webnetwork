import { WhereOptions, FindAttributeOptions } from "sequelize";

export function getAssociation(association: string,
                               attributes: FindAttributeOptions = undefined,
                               required = false, 
                               where: WhereOptions = {},
                               include = [],
                               on = undefined) {
  return {
    association,
    attributes,
    required,
    where,
    include,
    on
  };
}