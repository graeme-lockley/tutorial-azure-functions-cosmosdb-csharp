import { exec } from "../exec.ts";
import { ILintResult, lintHandlerAction, Schema } from "./declarations.ts";
import type { AzureCosmosCreate } from "./schema/azure__cosmos__create.ts";

import schema from "./schema/azure__cosmos__create.json" assert {
  type: "json",
};

const handlerName = "azure/cosmos/create";

const lint = (result: Array<ILintResult>, action: AzureCosmosCreate): void =>
  lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = (action: AzureCosmosCreate): string => {
  const locationSuffix = action.location === undefined
    ? ""
    : ` --locations "regionName=${action.location}"`;

  return `az cosmosdb create --name "${action.name}" --resource-group "${action.rg}"${locationSuffix}`;
};

const run = async (action: AzureCosmosCreate): Promise<void> => {
  const command = commandFromAction(action);

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
