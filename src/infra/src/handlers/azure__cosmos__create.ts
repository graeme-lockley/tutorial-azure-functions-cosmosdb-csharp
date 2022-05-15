import { exec } from "../exec.ts";
import { lintHandlerAction, Schema } from "./declarations.ts";
import type { AzureCosmosCreate } from "./schema/azure__cosmos__create.ts";
import { ILintResult } from "../cmds/lint.ts";

import schema from "./schema/azure__cosmos__create.json" assert {
  type: "json",
};
import { evaluate } from "../expression-evaluation.ts";

const handlerName = "azure/cosmos/create";

const lint = (result: Array<ILintResult>, action: AzureCosmosCreate): void =>
  lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = async (
  action: AzureCosmosCreate,
): Promise<string> => {
  const name = await evaluate(action.name);
  const rg = await evaluate(action.rg);
  const location = action.location === undefined
    ? undefined
    : await evaluate(action.location);

  const locationSuffix = location === undefined
    ? ""
    : ` --locations "regionName=${location}"`;

  return `az cosmosdb create --name "${name}" --resource-group "${rg}"${locationSuffix}`;
};

const run = async (action: AzureCosmosCreate): Promise<void> => {
  const command = await commandFromAction(action);

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
