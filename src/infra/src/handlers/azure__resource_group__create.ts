import { exec } from "../exec.ts";
import { IActionHandler, lintHandlerAction, Schema } from "./declarations.ts";
import type { AzureResourceGroupCreate } from "./schema/azure__resource_group__create.ts";
import { ILintResult } from "../cmds/lint.ts";

import schema from "./schema/azure__resource_group__create.json" assert {
  type: "json",
};
import { evaluate } from "../expression-evaluation.ts";

const handlerName = "azure/resource-group/create";

const lint = (
  result: Array<ILintResult>,
  action: AzureResourceGroupCreate,
): void => lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = async (
  action: AzureResourceGroupCreate,
): Promise<string> => {
  const name = await evaluate(action.name);
  const location = await evaluate(action.location);

  return `az group create -l "${location}" -n "${name}"`;
};

const run = async (action: AzureResourceGroupCreate): Promise<string> => {
  const command = await commandFromAction(action);

  return await exec(command, handlerName, action.id, action.name);
};

const rollback = async (action: AzureResourceGroupCreate): Promise<void> => {
  const name = await evaluate(action.name);

  await exec(
    `az group delete --name "${name}" --yes`,
    handlerName,
    action.id,
    action.name,
  );
};

export const handler: IActionHandler<AzureResourceGroupCreate> = {
  type: handlerName,
  lint,
  run,
  rollback,
};
