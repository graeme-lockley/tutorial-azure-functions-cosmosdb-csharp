import { exec } from "../exec.ts";
import { lintHandlerAction, Schema } from "./declarations.ts";
import type { AzureResourceGroupDelete } from "./schema/azure__resource_group__delete.ts";
import { ILintResult } from "../cmds/lint.ts";

import schema from "./schema/azure__resource_group__delete.json" assert {
  type: "json",
};
import { evaluate } from "../expression-evaluation.ts";

const handlerName = "azure/resource-group/delete";

const lint = (
  result: Array<ILintResult>,
  action: AzureResourceGroupDelete,
): void => lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = async (action: AzureResourceGroupDelete): Promise<string> => {
  const name = await evaluate(action.name);

  const suffix = action.wait === undefined || action.wait ? "" : " --no-wait";

  return `az group delete --name "${name}"${suffix} --yes`;
}

const run = async (action: AzureResourceGroupDelete): Promise<void> => {
  const command = await commandFromAction(action);

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
