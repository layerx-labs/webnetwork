import {Sequelize} from "sequelize";
import {Col, Fn, Literal} from "sequelize/types/utils";

export const castToInt = (col: string | Fn | Col | Literal) => Sequelize.cast(col, "int");