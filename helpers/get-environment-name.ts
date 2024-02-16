import dotenv from "dotenv";

import { EnvironmentName } from "interfaces/enums/environment-name";

dotenv.config();

const stagingNames = ["afrodite", "apollodorus", "aurelius", "diogenes", "irene", "seneca"];

export function getEnvironmentName (): EnvironmentName {
  const homeUrl = process.env.NEXT_PUBLIC_HOME_URL;
  if (homeUrl?.includes("localhost"))
    return EnvironmentName.Development;
  if (stagingNames.some(name => homeUrl?.includes(name)))
    return EnvironmentName.Staging;
  return EnvironmentName.Production;
}