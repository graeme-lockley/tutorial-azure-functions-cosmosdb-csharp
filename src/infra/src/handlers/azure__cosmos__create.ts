import { exec } from "../exec.ts";
import {
  IAction,
  ILintResult,
  lintHandlerAction,
  Schema,
} from "./declarations.ts";

import schema from "./schema/azure__cosmos__create.json" assert {
  type: "json",
};

const handlerName = "azure/cosmos/create";

export interface IHandlerAction extends IAction {
  name?: string | undefined;
  rg?: string | undefined;
  location?: string | undefined;
}

const lint = (result: Array<ILintResult>, action: IHandlerAction): void =>
  lintHandlerAction(result, schema as Schema, handlerName, action);

export const commandFromAction = (action: IHandlerAction): string => {
  const locationSuffix = action.location === undefined
    ? ""
    : ` --locations "regionName=${action.location}"`;

  return `az cosmosdb create --name "${action.name}" --resource-group "${action.rg}"${locationSuffix}`;
};

const run = async (action: IHandlerAction): Promise<void> => {
  const command = commandFromAction(action);

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint,
  run,
};
