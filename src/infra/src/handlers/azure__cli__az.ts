import { exec } from "../exec.ts";
import { lintHandlerAction, Schema } from "./declarations.ts";
import type { AzureCliAz } from "./schema/azure__cli__az.ts";
import { ILintResult } from "../cmds/lint.ts";

import schema from "./schema/azure__cli__az.json" assert {
  type: "json",
};
import { evaluate } from "../expression-evaluation.ts";

const handlerName = "azure/cli/az";

const lint = (result: Array<ILintResult>, action: AzureCliAz): void =>
  lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = (
  action: AzureCliAz,
): Promise<string> => evaluate(action.run);

const run = async (action: AzureCliAz): Promise<void> => {
  const command = await commandFromAction(action);

  await exec(command, handlerName, action.id);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
