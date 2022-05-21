import { exec } from "../exec.ts";
import { IActionHandler, lintHandlerAction, Schema } from "./declarations.ts";
import type { AzureCliAz } from "./schema/azure__cli__az.ts";
import { ILintResult } from "../cmds/lint.ts";

import schema from "./schema/azure__cli__az.json" assert {
  type: "json",
};
import { evaluate } from "../expression-evaluation.ts";
import { failOnError } from "../logging.ts";

const handlerName = "azure/cli/az";

const lint = (result: Array<ILintResult>, action: AzureCliAz): void =>
  lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = (
  action: AzureCliAz,
): Promise<string> => evaluate(action.run);

const run = async (action: AzureCliAz): Promise<string> => {
  const command = await commandFromAction(action);

  return await exec(command, handlerName, action.id);
};

const rollback = async (action: AzureCliAz): Promise<void> => {
  if (action.rollback === undefined) {
    failOnError(`Error: ${handlerName}: Unable to rollback`);
    Deno.exit(1);
  }

  const script = await evaluate(action.rollback);

  await exec(script, handlerName, action.id);
};

export const handler: IActionHandler<AzureCliAz> = {
  type: handlerName,
  lint,
  run,
  rollback,
};
