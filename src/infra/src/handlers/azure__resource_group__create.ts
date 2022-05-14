import { exec } from "../exec.ts";
import {
  IAction,
  ILintResult,
  lintHandlerAction,
  Schema,
} from "./declarations.ts";

import schema from "./schema/azure__resource_group__create.json" assert {
  type: "json",
};

const handlerName = "azure/resource-group/create";

export interface IHandlerAction extends IAction {
  name?: string | undefined;
  location?: string | undefined;
}

export const commandFromAction = (action: IHandlerAction): string =>
  `az group create -l "${action.location}" -n "${action.name}"`;

const run = async (action: IHandlerAction): Promise<void> => {
  const command = commandFromAction(action);

  await exec(command, handlerName, action.id, action.name);
};

export const handler = {
  type: handlerName,
  lint: (
    result: Array<ILintResult>,
    action: IHandlerAction,
  ): void => lintHandlerAction(result, schema as Schema, handlerName, action),
  run,
};
