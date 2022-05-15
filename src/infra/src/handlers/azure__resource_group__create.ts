import { exec } from "../exec.ts";
import { lintHandlerAction, Schema } from "./declarations.ts";
import type { AzureResourceGroupCreate } from "./schema/azure__resource_group__create.ts";
import { ILintResult } from "../cmds/lint.ts";

import schema from "./schema/azure__resource_group__create.json" assert {
  type: "json",
};

const handlerName = "azure/resource-group/create";

const lint = (
  result: Array<ILintResult>,
  action: AzureResourceGroupCreate,
): void => lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = (action: AzureResourceGroupCreate): string =>
  `az group create -l "${action.location}" -n "${action.name}"`;

const run = async (action: AzureResourceGroupCreate): Promise<void> => {
  const command = commandFromAction(action);

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
